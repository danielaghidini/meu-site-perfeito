import { Request, Response } from "express";
import { prisma } from "../db.js";

export const getAllFAQs = async (req: Request, res: Response) => {
	try {
		const faqs = await prisma.fAQ.findMany({
			where: { status: "PUBLISHED" },
			orderBy: { order: "asc" },
		});
		res.json(faqs);
	} catch (error) {
		console.error("Fetch FAQs error:", error);
		res.status(500).json({ error: "Failed to fetch FAQs" });
	}
};

export const getAllFAQsAdmin = async (req: Request, res: Response) => {
	try {
		const faqs = await prisma.fAQ.findMany({
			include: { author: { select: { name: true, email: true } } },
			orderBy: [{ status: "desc" }, { createdAt: "desc" }],
		});
		res.json(faqs);
	} catch (error) {
		console.error("Fetch Admin FAQs error:", error);
		res.status(500).json({ error: "Failed to fetch FAQs" });
	}
};

export const createFAQ = async (req: Request, res: Response) => {
	const { question, answer, category, order, status } = req.body;
	try {
		const faq = await prisma.fAQ.create({
			data: {
				question,
				answer,
				category: category || "General",
				order: order || 0,
				status: status || "PUBLISHED",
			},
		});
		res.status(201).json(faq);
	} catch (error) {
		console.error("Create FAQ error:", error);
		res.status(500).json({ error: "Failed to create FAQ" });
	}
};

export const submitFAQ = async (req: Request, res: Response) => {
	const { question } = req.body;
	const userId = (req as any).user?.id;

	if (!question) {
		return res.status(400).json({ error: "Question is required" });
	}

	try {
		const faq = await prisma.fAQ.create({
			data: {
				question,
				status: "PENDING",
				authorId: userId,
			},
		});
		res.status(201).json(faq);
	} catch (error) {
		console.error("Submit FAQ error:", error);
		res.status(500).json({ error: "Failed to submit question" });
	}
};

export const updateFAQ = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { question, answer, category, order, status } = req.body;
	try {
		const faq = await prisma.fAQ.update({
			where: { id: String(id) },
			data: { question, answer, category, order, status },
		});
		res.json(faq);
	} catch (error) {
		console.error("Update FAQ error:", error);
		res.status(500).json({ error: "Failed to update FAQ" });
	}
};

export const deleteFAQ = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await prisma.fAQ.delete({
			where: { id: String(id) },
		});
		res.json({ message: "FAQ deleted successfully" });
	} catch (error) {
		console.error("Delete FAQ error:", error);
		res.status(500).json({ error: "Failed to delete FAQ" });
	}
};
