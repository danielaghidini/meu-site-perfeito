import { Request, Response } from "express";
import { prisma } from "../db.js";

export const getAllProjects = async (req: Request, res: Response) => {
	try {
		const projects = await prisma.project.findMany({
			orderBy: { isFeatured: "desc" }, // Destaques primeiro
		});
		res.json(projects);
	} catch (error) {
		console.error("Error fetching projects:", error);
		res.status(500).json({ error: "Failed to fetch projects" });
	}
};

export const getProjectBySlug = async (req: Request, res: Response) => {
	const slug = req.params.slug as string;
	try {
		const project = await prisma.project.findUnique({
			where: { slug: slug },
		});
		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}
		res.json(project);
	} catch (error) {
		console.error("Error fetching project:", error);
		res.status(500).json({ error: "Failed to fetch project" });
	}
};

export const createProject = async (req: Request, res: Response) => {
	const {
		title,
		slug,
		description,
		shortDescription,
		coverUrl,
		technologies,
		liveUrl,
		repoUrl,
		isFeatured,
	} = req.body;
	try {
		const project = await prisma.project.create({
			data: {
				title,
				slug,
				description,
				shortDescription,
				coverUrl,
				technologies,
				liveUrl,
				repoUrl,
				isFeatured: isFeatured || false,
			},
		});
		res.status(201).json(project);
	} catch (error) {
		console.error("Error creating project:", error);
		res.status(500).json({ error: "Failed to create project" });
	}
};

export const updateProject = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	const data = req.body;
	try {
		const project = await prisma.project.update({
			where: { id: id },
			data,
		});
		res.json(project);
	} catch (error) {
		console.error("Error updating project:", error);
		res.status(500).json({ error: "Failed to update project" });
	}
};

export const deleteProject = async (req: Request, res: Response) => {
	const id = req.params.id as string;
	try {
		await prisma.project.delete({
			where: { id: id },
		});
		res.status(204).send();
	} catch (error) {
		console.error("Error deleting project:", error);
		res.status(500).json({ error: "Failed to delete project" });
	}
};
