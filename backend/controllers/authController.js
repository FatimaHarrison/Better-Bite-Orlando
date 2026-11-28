import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";


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


    // DEF-011: No registration verification email received
    try {
      await sendWelcomeEmail(newUser);
    } catch (error) {
      console.error("Registration confirmation email delivery failed.");
    }

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


// DEF-011: No registration verification email received

const sendWelcomeEmail = async (user) => {

  const signInUrl = new URL (
    `${process.env.FRONTEND_URL.replace(/\/+$/, "")}/login.html`
  );

  await mailer.sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,

    subject: "Welcome to Better Bite Orlando",

    text: `
  Congratulations, ${user.firstName}!
  
  Your Better Bite Orlando has been successfully created.
  
  Your can now discover local grocery stores, healthy restaurants,
  nutritious recipes, and community food resources.
  
  Sign in to your account:
  ${signInUrl.toString()}
  
  If you did not create this account, you can ignore this email.
  
  The Better Bite Orlando Team
          `,

          html: `
          <div style="
              background-color: #F4ECE5;
              padding: 30px 15px;
            font-family: Arial, sans-serif;
            color: #333333;
        ">

            <div style="
                max-width: 600px;
                margin: 0 auto;
                background-color: #FFFFFF;
                border-radius: 16px;
                overflow: hidden;
            ">

                <div style="
                    background-color: #3D622C;
                    padding: 30px;
                    text-align: center;
                    color: #FFFFFF;
                ">
                    <h1 style="margin: 0;">
                        Better Bite Orlando
                    </h1>
                </div>

                <div style="padding: 35px;">

                    <h2 style="color: #3D622C;">
                        Welcome to our community!
                    </h2>

                    <p>
                        Congratulations! Your Better Bite Orlando
                        account has been successfully created.
                    </p>

                    <p>
                        You are now ready to explore:
                    </p>

                    <ul style="line-height: 2;">
                        <li>Local grocery stores and farmers markets</li>
                        <li>Healthy restaurants near you</li>
                        <li>Delicious and nutritious recipes</li>
                        <li>Community food assistance resources</li>
                    </ul>

                    <div style="
                        text-align: center;
                        margin: 30px 0;
                    ">
                        <a href="${signInUrl.toString()}"
                            style="
                                background-color: #3D622C;
                                color: #FFFFFF;
                                padding: 14px 28px;
                                border-radius: 8px;
                                text-decoration: none;
                                font-weight: bold;
                                display: inline-block;
                            ">
                            Sign In to Your Account
                        </a>
                    </div>

                    <p>
                        Thank you for joining Better Bite Orlando!
                    </p>

                    <p>
                        The Better Bite Orlando Team
                    </p>

                </div>

                <div style="
                    background-color: #F4ECE5;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #555555;
                ">
                    If you did not create this account,
                    you can ignore this email.
                    <br><br>
                    &copy; 2026 Better Bite Orlando
                </div>

            </div>
        </div>
        `,
    });
};

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

// GET /auth/profile
// Return the currently authenticated user's information
const getCurrentUser = async (req, res) => {
  try {
    // Retrieve the JWT from the authentication cookie
    const authCookie = req.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("bbo_auth="));

    const token = authCookie?.slice("bbo_auth=".length);

    if (!token) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }

    // Verify the existing authentication token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!Number.isInteger(decoded.id)) {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }

    // Retrieve the user without sensitive fields
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        defaultZipCode: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

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
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Invalid or expired authentication token",
      });
    }

    console.error("Get current user failed:", error);

    return res.status(500).json({
      error: "Unable to retrieve user information",
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
