import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { prisma } from "../db.js";

// Categories
export const createCategory = async (req: AuthRequest, res: Response) => {
	const { name, description } = req.body;
	try {
		const category = await prisma.category.create({
			data: { name, description },
		});
		res.status(201).json(category);
	} catch (error) {
		console.error("Create category error:", error);
		res.status(500).json({ error: "Failed to create category" });
	}
};

// Articles
export const createArticle = async (req: AuthRequest, res: Response) => {
	try {
		const { title, slug, content, excerpt, categoryId, published } =
			req.body;
		const article = await prisma.article.create({
			data: {
				title,
				slug,
				content,
				excerpt,
				categoryId,
				published,
				authorId: req.user?.id,
			},
		});
		res.status(201).json(article);
	} catch (error) {
		res.status(500).json({ error: "Error creating article" });
	}
};

export const updateArticle = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params as { id: string };
		const article = await prisma.article.findUnique({ where: { id } });

		if (!article) {
			return res.status(404).json({ error: "Article not found" });
		}

		if (req.user.role !== "ADMIN" && article.authorId !== req.user.id) {
			return res
				.status(403)
				.json({ error: "Access denied. Not the author." });
		}

		const updatedArticle = await prisma.article.update({
			where: { id },
			data: req.body,
		});
		res.json(updatedArticle);
	} catch (error) {
		res.status(500).json({ error: "Error updating article" });
	}
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params as { id: string };
		const article = await prisma.article.findUnique({ where: { id } });

		if (!article) {
			return res.status(404).json({ error: "Article not found" });
		}

		if (req.user.role !== "ADMIN" && article.authorId !== req.user.id) {
			return res
				.status(403)
				.json({ error: "Access denied. Not the author." });
		}

		await prisma.article.delete({ where: { id } });
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Error deleting article" });
	}
};

// Quests
export const createQuest = async (req: AuthRequest, res: Response) => {
	try {
		const { title, slug, description, difficulty, rewards } = req.body;
		const quest = await prisma.quest.create({
			data: {
				title,
				slug,
				description,
				difficulty,
				rewards,
				authorId: req.user?.id,
			},
		});
		res.status(201).json(quest);
	} catch (error) {
		res.status(500).json({ error: "Error creating quest" });
	}
};

export const updateQuest = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params as { id: string };
		const quest = await prisma.quest.findUnique({ where: { id } });

		if (!quest) {
			return res.status(404).json({ error: "Quest not found" });
		}

		if (req.user.role !== "ADMIN" && quest.authorId !== req.user.id) {
			return res
				.status(403)
				.json({ error: "Access denied. Not the author." });
		}

		const updatedQuest = await prisma.quest.update({
			where: { id },
			data: req.body,
		});
		res.json(updatedQuest);
	} catch (error) {
		res.status(500).json({ error: "Error updating quest" });
	}
};

export const deleteQuest = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params as { id: string };
		const quest = await prisma.quest.findUnique({ where: { id } });

		if (!quest) {
			return res.status(404).json({ error: "Quest not found" });
		}

		if (req.user.role !== "ADMIN" && quest.authorId !== req.user.id) {
			return res
				.status(403)
				.json({ error: "Access denied. Not the author." });
		}

		await prisma.quest.delete({ where: { id } });
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Error deleting quest" });
	}
};
