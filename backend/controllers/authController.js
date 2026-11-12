import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import crypto from "node:crypto";
import nodemailer from "nodemailer";


const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, zipcode } = req.body || {};

    // Validate required fields
    if (
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" ||
      typeof zipcode !== "string" ||
      !/^\d{5}(-\d{4})?$/.test(zipcode)
    ) {
      return res.status(400).json({
        error: "Invalid or missing registration fields",
      });
    }

    if (
      firstName.trim().length > 50 ||
      lastName.trim().length > 50 ||
      email.trim().length > 100 ||
      password.length < 12 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        error: "Registration field length is invalid",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (userExists) {
      return res.status(409).json({
        error: "An account already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        passwordHash: hashedPassword,
        defaultZipCode: zipcode,
      },
    });

    const token = generateToken(newUser.id, res);

    return res.status(201).json({
      status: "success",
      data: {
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          zipcode: newUser.defaultZipCode,
        },
        token,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "An account already exists with this email",
      });
    }

    console.error("Registration failed:", error.message);

    return res.status(500).json({
      error: "Unable to register user",
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user.id, res);

    return res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          zipcode: user.defaultZipCode,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    return res.status(500).json({
      error: "Unable to log in",
    });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("bbo_auth", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};

const mailer = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT || 587),
	secure: Number(process.env.SMTP_PORT || 587) === 465,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

const forgotPassword = async (req, res) => {
	const email = req.body?.email;

	if (typeof email !== "string" || !email.trim()) {
		return res.status(400).json({
			error: "A valid email address is required",
		});
	}

	const response = {
		status: "success",
		message: "If an account exists, a password reset link will be sent.",
	};

	try {
		const user = await prisma.user.findUnique({
			where: { email: email.trim() },
		});

		// Keep the response identical to avoid revealing registered emails.
		if (!user) {
			return res.status(200).json(response);
		}

		const token = crypto.randomBytes(32).toString("hex");
		const tokenHash = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		await prisma.user.update({
			where: { id: user.id },
			data: {
				passwordResetToken: tokenHash,
				passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000),
			},
		});

		// This frontend page submits the token and password to the API.
		const resetUrl = new URL("/reset-password", process.env.FRONTEND_URL);
		resetUrl.searchParams.set("token", token);

		try {
			await mailer.sendMail({
				from: process.env.SMTP_FROM,
				to: user.email,
				subject: "Reset your password",
				text:
					`Reset your password using this link:\n${resetUrl.toString()}\n\n` +
					"This link expires in 15 minutes. " +
					"If you did not request this, ignore this email.",
			});
		} catch (error) {
			// Do not clear a newer token from a concurrent request.
			await prisma.user.updateMany({
				where: {
					id: user.id,
					passwordResetToken: tokenHash,
				},
				data: {
					passwordResetToken: null,
					passwordResetExpires: null,
				},
			});

			console.error("Password reset email delivery failed");
		}

		return res.status(200).json(response);
	} catch (error) {
		console.error("Password reset request failed");

		return res.status(500).json({
			error: "Unable to process the password reset request",
		});
	}
};

const resetPassword = async (req, res) => {
	const { token, password } = req.body || {};

	if (
		typeof token !== "string" ||
		!/^[a-f0-9]{64}$/.test(token) ||
		typeof password !== "string"
	) {
		return res.status(400).json({
			error: "A valid reset token and new password are required",
		});
	}

	// bcrypt limitation
	if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
		return res.status(400).json({
			error: "Password must be at least 12 characters and at most 72 bytes",
		});
	}

	try {
		const tokenHash = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		const hashedPassword = await bcrypt.hash(password, 10);

		// Atomically update the password and consume the token.
		// Concurrent submissions cannot reuse the same token.
		const result = await prisma.user.updateMany({
			where: {
				passwordResetToken: tokenHash,
				passwordResetExpires: { gt: new Date() },
			},
			data: {
				passwordHash: hashedPassword,
				passwordResetToken: null,
				passwordResetExpires: null,
			},
		});

		if (result.count === 0) {
			return res.status(400).json({
				error: "Reset token is invalid or has expired",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "Password reset successfully. Please log in.",
		});
	} catch (error) {
		console.error("Password reset failed");

		return res.status(500).json({
			error: "Unable to reset password",
		});
	}
};

export { registerUser, loginUser, logoutUser, forgotPassword, resetPassword };
