import express from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

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
	//check if syntax works
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create a new user in the database with the hashed password
	const newUser = await prisma.user.create({
		data: {
			name: username,
			email,
			password: hashedPassword,
		},
	});

	const token = generateToken(userExists.id, res);

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

export { registerUser, loginUser, logoutUser };
