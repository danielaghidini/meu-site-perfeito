import { Request, Response } from "express";
import { prisma } from "../db.js";

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
		});
		res.json(users);
	} catch (error) {
		console.error("Fetch users error:", error);
		res.status(500).json({ error: "Failed to fetch users" });
	}
};

export const updateUserRole = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const { role } = req.body;

	if (typeof role !== "string" || !["USER", "ADMIN"].includes(role)) {
		return res.status(400).json({ error: "Invalid role" });
	}

	try {
		const updatedUser = await prisma.user.update({
			where: { id: String(userId) },
			data: { role: role as string },
			select: { id: true, role: true },
		});
		res.json(updatedUser);
	} catch (error) {
		console.error("Update role error:", error);
		res.status(500).json({ error: "Failed to update user role" });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	const { userId } = req.params;

	try {
		await prisma.user.delete({
			where: { id: String(userId) },
		});
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Delete user error:", error);
		res.status(500).json({ error: "Failed to delete user" });
	}
};
