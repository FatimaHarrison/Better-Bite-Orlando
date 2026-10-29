import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import crypto from "node:crypto";
import nodemailer from "nodemailer";

const registerUser = async (req, res) => {
	const { username, email, password } = req.body;

	const userExists = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (userExists) {
		return res.status(400).json({
			error: "An User already exists with this email",
		});
	}

	// Hash the password before storing it in the database
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create a new user in the database with the hashed password
	const newUser = await prisma.user.create({
		data: {
			name: username,
			email,
			password: hashedPassword,
		},
	});

	const token = generateToken(newUser.id, res);

	res.status(201).json({
		status: "success",
		data: {
			user: {
				id: newUser.id,
				name: username,
				email: email,
			},
			token,
		},
	});
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	const userExists = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (!userExists) {
		return res.status(401).json({
			error: "Invalid email or password",
		});
	}

	const isPasswordValid = await bcrypt.compare(password, userExists.password);

	if (!isPasswordValid) {
		return res.status(401).json({
			error: "Invalid email or password",
		});
	}

	//Token generation
	const token = generateToken(userExists.id, res);

	res.status(200).json({
		status: "success",
		data: {
			user: {
				id: userExists.id,
				email: email,
			},
			token,
		},
	});
};

const logoutUser = async (req, res) => {
	res.cookie("cookie", "", {
		expires: new Date(0),
		httpOnly: true,
	});

	res.status(200).json({
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
				password: hashedPassword,
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
