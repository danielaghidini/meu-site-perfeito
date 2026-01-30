import { Request, Response } from "express";
import { prisma } from "../db.js";

export const createContact = async (req: Request, res: Response) => {
	try {
		const { name, email, phone, company, project, message } = req.body;
		const contact = await prisma.contact.create({
			data: {
				name,
				email,
				phone,
				company,
				project,
				message,
			},
		});
		res.status(201).json(contact);
	} catch (error) {
		console.error("Create contact error:", error);
		res.status(500).json({ error: "Failed to send message" });
	}
};

export const getAllContacts = async (req: Request, res: Response) => {
	try {
		const contacts = await prisma.contact.findMany({
			orderBy: { createdAt: "desc" },
		});
		res.json(contacts);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch messages" });
	}
};

export const updateContactStatus = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const contact = await prisma.contact.update({
			where: { id },
			data: { status },
		});
		res.json(contact);
	} catch (error) {
		res.status(500).json({ error: "Failed to update message status" });
	}
};

export const deleteContact = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await prisma.contact.delete({
			where: { id },
		});
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Failed to delete message" });
	}
};
