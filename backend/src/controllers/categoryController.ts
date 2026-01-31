import { Request, Response } from "express";
import { prisma } from "../db.js";

export const getAllCategories = async (req: Request, res: Response) => {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { name: "asc" },
		});
		res.json(categories);
	} catch (error) {
		console.error("Fetch categories error:", error);
		res.status(500).json({ error: "Failed to fetch categories" });
	}
};

export const createCategory = async (req: Request, res: Response) => {
	const { name, description } = req.body;

	if (!name) {
		return res.status(400).json({ error: "Name is required" });
	}

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

export const deleteCategory = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const categoryIdStr = id as string;
		// First, nullify categoryId for all articles in this category
		// (Optional, depending on if you want cascade delete or just remove category)
		await prisma.article.updateMany({
			where: { categoryId: categoryIdStr },
			data: { categoryId: null },
		});

		await prisma.category.delete({
			where: { id: categoryIdStr },
		});
		res.status(204).send();
	} catch (error) {
		console.error("Delete category error:", error);
		res.status(500).json({ error: "Failed to delete category" });
	}
};
