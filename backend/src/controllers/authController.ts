import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_key";

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password, name } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ error: "Email and password are required" });
		}

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ error: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				role: "USER", // Default role
			},
		});

		const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
			expiresIn: "1d",
		});

		res.status(201).json({
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				avatar: null,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({ error: "Error registering user" });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
			expiresIn: "1d",
		});

		res.status(200).json({
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				avatar: user.avatar,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Login controller error:", error);
		res.status(500).json({
			error: "Error logging in",
			details: error instanceof Error ? error.message : String(error),
		});
	}
};

export const getMe = async (req: Request, res: Response) => {
	try {
		// req.user is set by authenticateToken middleware
		const userId = (req as any).user?.id;

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				name: true,
				avatar: true,
				role: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("GetMe error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateProfile = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.id;

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const { name, currentPassword, newPassword, avatar } = req.body;

		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Build update data
		const updateData: any = {};

		if (name !== undefined) {
			updateData.name = name;
		}

		if (avatar !== undefined) {
			updateData.avatar = avatar;
		}

		// If changing password, verify current password first
		if (newPassword) {
			if (!currentPassword) {
				return res.status(400).json({
					error: "Current password is required to change password",
				});
			}

			const validPassword = await bcrypt.compare(
				currentPassword,
				user.password,
			);
			if (!validPassword) {
				return res
					.status(400)
					.json({ error: "Current password is incorrect" });
			}

			const salt = await bcrypt.genSalt(10);
			updateData.password = await bcrypt.hash(newPassword, salt);
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: updateData,
			select: {
				id: true,
				email: true,
				name: true,
				avatar: true,
				role: true,
			},
		});

		res.json({
			message: "Profile updated successfully",
			user: updatedUser,
		});
	} catch (error) {
		console.error("UpdateProfile error:", error);
		res.status(500).json({ error: "Error updating profile" });
	}
};
