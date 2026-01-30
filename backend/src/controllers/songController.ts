import { Request, Response } from "express";
import { prisma } from "../db.js";

export const getAllSongs = async (req: Request, res: Response) => {
	try {
		const songs = await prisma.song.findMany({
			orderBy: { createdAt: "desc" },
		});
		res.json(songs);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const createSong = async (req: Request, res: Response) => {
	const { title, description, fileName } = req.body;
	if (!title || !description || !fileName) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		const song = await prisma.song.create({
			data: { title, description, fileName },
		});
		res.json(song);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const updateSong = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, description, fileName } = req.body;

	try {
		const song = await prisma.song.update({
			where: { id: String(id) },
			data: { title, description, fileName },
		});
		res.json(song);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const deleteSong = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await prisma.song.delete({
			where: { id: String(id) },
		});
		res.json({ message: "Song deleted" });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};
