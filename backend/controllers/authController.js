import express from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

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

	res.status(201).json({
		status: "success",
		data: {
			user: {
				id: newUser.id,
				name: username,
				email: email,
			},
		},
	});
};

export { registerUser };
