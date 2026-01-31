import { Request, Response } from "express";
import { prisma } from "../db.js";

export const getAllImages = async (req: Request, res: Response) => {
	try {
		// Buscamos todas as imagens únicas das tabelas Article e Project
		const articles = await prisma.article.findMany({
			select: { coverUrl: true },
			where: { NOT: { coverUrl: null } },
		});

		const projects = await prisma.project.findMany({
			select: { coverUrl: true },
			where: { NOT: { coverUrl: null } },
		});

		// Pegamos avatares de usuários também, se houver
		const users = await prisma.user.findMany({
			select: { avatar: true },
			where: { NOT: { avatar: null } },
		});

		// Consolidamos e limpamos duplicatas
		const allUrls = [
			...articles.map((a) => a.coverUrl),
			...projects.map((p) => p.coverUrl),
			...users.map((u) => u.avatar),
		].filter((url): url is string => !!url);

		const uniqueUrls = [...new Set(allUrls)];

		// Retornamos como uma lista de objetos para manter padrão
		const images = uniqueUrls.map((url, index) => ({
			id: `img-${index}`,
			url,
		}));

		res.json(images);
	} catch (error) {
		console.error("Fetch images error:", error);
		res.status(500).json({ error: "Failed to fetch images" });
	}
};
