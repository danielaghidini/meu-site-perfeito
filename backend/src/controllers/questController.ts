import { Request, Response } from "express";
import { prisma } from "../db.js";

// Get all quests
export const getQuests = async (req: Request, res: Response) => {
	try {
		const quests = await prisma.quest.findMany({
			orderBy: {
				order: "asc",
			},
		});
		res.json(quests);
	} catch (error) {
		res.status(500).json({ message: "Error fetching quests", error });
	}
};

// Get single quest by slug
export const getQuestBySlug = async (req: Request, res: Response) => {
	const { slug } = req.params as { slug: string };
	try {
		const quest = await prisma.quest.findUnique({
			where: { slug },
			include: {
				steps: {
					orderBy: {
						order: "asc",
					},
				},
			},
		});
		if (!quest) {
			return res.status(404).json({ message: "Quest not found" });
		}
		res.json(quest);
	} catch (error) {
		res.status(500).json({ message: "Error fetching quest", error });
	}
};

// Create a new quest
export const createQuest = async (req: Request, res: Response) => {
	const {
		title,
		slug,
		description,
		summary,
		order,
		isMainQuest,
		category,
		difficulty,
		rewards,
		steps,
	} = req.body;
	try {
		const newQuest = await prisma.quest.create({
			data: {
				title,
				slug,
				description,
				summary,
				order: parseInt(order),
				category:
					category ||
					(isMainQuest === "true" || isMainQuest === true
						? "Main"
						: "Side"),
				difficulty,
				rewards,
				steps: {
					create: steps?.map((step: any, index: number) => ({
						title: step.title,
						description: step.description,
						videoUrl: step.videoUrl,
						order: index + 1,
					})),
				},
			},
			include: {
				steps: true,
			},
		});
		res.status(201).json(newQuest);
	} catch (error) {
		res.status(500).json({ message: "Error creating quest", error });
	}
};

// Update an existing quest
export const updateQuest = async (req: Request, res: Response) => {
	const { id } = req.params as { id: string };
	const {
		title,
		slug,
		description,
		summary,
		order,
		isMainQuest,
		category,
		difficulty,
		rewards,
		steps,
	} = req.body;
	try {
		// Update quest details
		const updatedQuest = await prisma.$transaction(async (prisma) => {
			const quest = await prisma.quest.update({
				where: { id },
				data: {
					title,
					slug,
					description,
					summary,
					order: parseInt(order),
					category:
						category ||
						(isMainQuest === "true" || isMainQuest === true
							? "Main"
							: undefined),
					difficulty,
					rewards,
				},
			});

			if (steps) {
				// Delete existing steps
				await prisma.questStep.deleteMany({
					where: { questId: id },
				});

				// Create new steps
				if (steps.length > 0) {
					await prisma.questStep.createMany({
						data: steps.map((step: any, index: number) => ({
							questId: id,
							title: step.title,
							description: step.description,
							videoUrl: step.videoUrl,
							order: index + 1,
						})),
					});
				}
			}

			return prisma.quest.findUnique({
				where: { id },
				include: { steps: { orderBy: { order: "asc" } } },
			});
		});

		res.json(updatedQuest);
	} catch (error) {
		res.status(500).json({ message: "Error updating quest", error });
	}
};

// Delete a quest
export const deleteQuest = async (req: Request, res: Response) => {
	const { id } = req.params as { id: string };
	try {
		await prisma.quest.delete({
			where: { id },
		});
		res.json({ message: "Quest deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting quest", error });
	}
};
