import { Request, Response } from "express";
import { prisma } from "../db.js";

export const getAllArticles = async (req: Request, res: Response) => {
	try {
		const { slug, published } = req.query;

		// Filtros opcionais
		const where: any = {};
		if (slug) where.slug = String(slug);
		if (published !== undefined) where.published = published === "true";

		const articles = await prisma.article.findMany({
			where,
			include: {
				category: true,
				user: { select: { name: true, avatar: true } },
			},
			orderBy: { createdAt: "desc" },
		});

		if (slug && articles.length > 0) {
			return res.json({ data: articles[0] });
		}

		res.json(articles);
	} catch (error) {
		console.error("Fetch articles error:", error);
		res.status(500).json({ error: "Failed to fetch articles" });
	}
};

export const getArticleBySlug = async (req: Request, res: Response) => {
	try {
		const slug = req.params.slug as string;
		const article = await prisma.article.findUnique({
			where: { slug },
			include: {
				category: true,
				user: { select: { name: true, avatar: true } },
			},
		});
		if (!article) return res.status(404).json({ error: "Post not found" });
		res.json({ data: article });
	} catch (error) {
		console.error("Fetch article error:", error);
		res.status(500).json({ error: "Error fetching article" });
	}
};

export const createArticle = async (req: Request, res: Response) => {
	const {
		title,
		slug,
		content,
		excerpt,
		categoryId,
		tags,
		coverUrl,
		isFeatured,
		published,
	} = req.body;

	try {
		let finalCategoryId = categoryId || null;

		if (!finalCategoryId && tags) {
			const category = await prisma.category.upsert({
				where: { name: tags },
				update: {},
				create: { name: tags },
			});
			finalCategoryId = category.id;
		}

		const article = await prisma.article.create({
			data: {
				title,
				slug,
				content,
				excerpt,
				categoryId: finalCategoryId,
				coverUrl,
				isFeatured: isFeatured || false,
				published: published || false,
				authorId: (req as any).user.id,
			},
			include: {
				category: true,
			},
		});
		res.status(201).json(article);
	} catch (error) {
		console.error("Create article error:", error);
		res.status(500).json({ error: "Failed to create article" });
	}
};

export const updateArticle = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	const {
		title,
		slug,
		content,
		excerpt,
		categoryId,
		tags,
		coverUrl,
		isFeatured,
		published,
	} = req.body;

	try {
		let finalCategoryId = categoryId || null;

		if (!finalCategoryId && tags) {
			const category = await prisma.category.upsert({
				where: { name: tags },
				update: {},
				create: { name: tags },
			});
			finalCategoryId = category.id;
		}

		const article = await prisma.article.update({
			where: { id },
			data: {
				title,
				slug,
				content,
				excerpt,
				categoryId: finalCategoryId,
				coverUrl,
				isFeatured,
				published,
			},
			include: {
				category: true,
			},
		});
		res.json(article);
	} catch (error) {
		console.error("Update article error:", error);
		res.status(500).json({ error: "Failed to update article" });
	}
};

export const deleteArticle = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		await prisma.article.delete({
			where: { id },
		});
		res.status(204).send();
	} catch (error) {
		console.error("Delete article error:", error);
		res.status(500).json({ error: "Failed to delete article" });
	}
};
