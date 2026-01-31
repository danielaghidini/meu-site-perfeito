import { Request, Response } from "express";
import { prisma } from "../db.js";

export const getStats = async (req: Request, res: Response) => {
	try {
		const [articlesCount, projectsCount, contactsCount, newContactsCount] =
			await Promise.all([
				prisma.article.count(),
				prisma.project.count(),
				prisma.contact.count(),
				prisma.contact.count({ where: { status: "NEW" } }),
			]);

		// Pegar atividades recentes (últimos 5 de cada)
		const recentArticles = await prisma.article.findMany({
			take: 5,
			orderBy: { createdAt: "desc" },
			select: { id: true, title: true, createdAt: true },
		});

		const recentProjects = await prisma.project.findMany({
			take: 5,
			orderBy: { createdAt: "desc" },
			select: { id: true, title: true, createdAt: true },
		});

		const recentContacts = await prisma.contact.findMany({
			take: 5,
			orderBy: { createdAt: "desc" },
			select: { id: true, name: true, createdAt: true, status: true },
		});

		// Combinar e ordenar atividades recentes
		const activities = [
			...recentArticles.map((a) => ({
				id: a.id,
				type: "article",
				title: a.title,
				date: a.createdAt,
			})),
			...recentProjects.map((p) => ({
				id: p.id,
				type: "project",
				title: p.title,
				date: p.createdAt,
			})),
			...recentContacts.map((c) => ({
				id: c.id,
				type: "contact",
				title: `Novo contato de ${c.name}`,
				date: c.createdAt,
				status: c.status,
			})),
		]
			.sort((a, b) => b.date.getTime() - a.date.getTime())
			.slice(0, 10);

		res.json({
			stats: {
				articles: articlesCount,
				projects: projectsCount,
				contacts: contactsCount,
				newContacts: newContactsCount,
			},
			activities,
		});
	} catch (error) {
		console.error("Error fetching dashboard stats:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
