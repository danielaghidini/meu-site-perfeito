import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { prisma } from "../db.js";

// GET all fan art (supports filtering by type)
export const getAllFanArt = async (req: Request, res: Response) => {
	const { type } = req.query;

	try {
		const where: any = {};
		if (type) {
			where.type = String(type);
		}

		const fanArt = await prisma.fanArt.findMany({
			where,
			orderBy: { createdAt: "desc" },
			include: {
				user: {
					select: { name: true, email: true },
				},
			},
		});
		res.json(fanArt);
	} catch (error) {
		console.error("Fetch fan art error:", error);
		res.status(500).json({ error: "Failed to fetch fan art" });
	}
};

// POST new fan art
export const createFanArt = async (req: AuthRequest, res: Response) => {
	const { title, imageUrl, artistName, description, type } = req.body;

	if (!title || !imageUrl || !artistName) {
		return res
			.status(400)
			.json({ error: "Title, image URL, and artist name are required" });
	}

	try {
		const fanArt = await prisma.fanArt.create({
			data: {
				title,
				imageUrl,
				artistName,
				description,
				type: type || "Fan Art",
				authorId: req.user?.id,
			},
		});
		res.status(201).json(fanArt);
	} catch (error) {
		console.error("Create fan art error:", error);
		res.status(500).json({ error: "Failed to create fan art" });
	}
};

// PUT update fan art
export const updateFanArt = async (req: AuthRequest, res: Response) => {
	const { id } = req.params as { id: string };
	try {
		const existingArt = await prisma.fanArt.findUnique({ where: { id } });

		if (!existingArt) {
			return res.status(404).json({ error: "Fan art not found" });
		}

		// Security: Admin or Owner
		if (req.user.role !== "ADMIN" && existingArt.authorId !== req.user.id) {
			return res.status(403).json({ error: "Access denied." });
		}

		const updatedArt = await prisma.fanArt.update({
			where: { id },
			data: req.body,
		});
		res.json(updatedArt);
	} catch (error) {
		console.error("Update fan art error:", error);
		res.status(500).json({ error: "Failed to update fan art" });
	}
};

// DELETE fan art
export const deleteFanArt = async (req: AuthRequest, res: Response) => {
	const { id } = req.params as { id: string };
	try {
		const existingArt = await prisma.fanArt.findUnique({ where: { id } });

		if (!existingArt) {
			return res.status(404).json({ error: "Fan art not found" });
		}

		// Security: Admin or Owner
		if (req.user.role !== "ADMIN" && existingArt.authorId !== req.user.id) {
			return res.status(403).json({ error: "Access denied." });
		}

		await prisma.fanArt.delete({ where: { id } });
		res.status(204).send();
	} catch (error) {
		console.error("Delete fan art error:", error);
		res.status(500).json({ error: "Failed to delete fan art" });
	}
};
