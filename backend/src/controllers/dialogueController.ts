import { Request, Response } from "express";
import { prisma } from "../db.js";
import { Prisma } from "@prisma/client";

// GET standard dialogues
export const getDialogues = async (req: Request, res: Response) => {
	const {
		page = 1,
		limit = 50,
		search = "",
		voiceType = "",
		subtype,
		city,
		emotion,
		questGroup,
		context,
		character,
	} = req.query;
	const skip = (Number(page) - 1) * Number(limit);

	try {
		const subTypesArray = subtype ? String(subtype).split(",") : [];
		const isScenesSelected = subTypesArray.includes("Scenes");

		const where: any = {};

		if (isScenesSelected) {
			where.OR = [
				{ fileName: { startsWith: "dialogueExport" } },
				{ fileName: { startsWith: "SceneDialogue" } },
			];
		} else {
			where.OR = [
				{ fileName: { startsWith: "dialogueExport" } },
				{ fileName: { equals: "ManualEntry" } },
			];
		}

		if (voiceType) {
			where.voiceType = { equals: String(voiceType) };
		}

		const andConditions: any[] = [];

		if (search) {
			andConditions.push({
				OR: [
					{
						topicText: {
							contains: String(search),
							mode: "insensitive",
						},
					},
					{
						responseText: {
							contains: String(search),
							mode: "insensitive",
						},
					},
				],
			});
		}

		if (subtype) {
			const orConditions: any[] = [];

			subTypesArray.forEach((type) => {
				if (type === "Thoughts") {
					orConditions.push({
						AND: [
							{
								questName: {
									in: [
										"DG04BjornThinkQuest",
										"DG04BjornFriendQuest",
									],
									mode: "insensitive",
								},
							},
							{
								topicText: {
									in: [
										"What's on your mind?",
										"What are you thinking about?",
									],
									mode: "insensitive",
								},
							},
						],
					});
				} else if (type === "Names") {
					orConditions.push({
						topicText: {
							contains: "name is",
							mode: "insensitive",
						},
					});
					orConditions.push({
						topicText: {
							contains: "call me",
							mode: "insensitive",
						},
					});
				} else if (type === "Combat") {
					orConditions.push({
						subtype: {
							in: [
								"Attack",
								"Hit",
								"NormalToCombat",
								"CombatToNormal",
								"BleedOut",
								"Taunt",
							],
						},
					});
				} else if (type === "Scenes") {
					orConditions.push({
						fileName: {
							startsWith: "SceneDialogue",
						},
					});
				} else {
					orConditions.push({ subtype: String(type) });
				}
			});

			if (orConditions.length > 0) {
				andConditions.push({ OR: orConditions });
			}
		}

		if (city) {
			andConditions.push({
				OR: [
					{
						topicText: {
							contains: String(city),
							mode: "insensitive",
						},
					},
					{
						responseText: {
							contains: String(city),
							mode: "insensitive",
						},
					},
				],
			});
		}

		if (emotion) {
			andConditions.push({
				emotion: {
					startsWith: String(emotion),
					mode: "insensitive",
				},
			});
		}

		if (questGroup) {
			const groups: Record<string, string[]> = {
				Main: ["DG04BjornPlayerAlduinQuest"],
				Companions: ["DG04BjornPlayerCompanions"],
				Mages: ["DG04BjornPlayerMageCollege"],
				Brotherhood: ["DG04BjornPlayerBrotherhood"],
				Thieves: ["DG04BjornPlayerThievesGuild"],
				Dawnguard: ["DG04BjornPlayerDawnguardDLC"],
				CivilWar: [
					"DG04BjornPlayerStormcloaks",
					"DG04BjornPlayerImperialLegion",
				],
			};

			const questList = groups[String(questGroup)];
			if (questList) {
				andConditions.push({
					questName: {
						in: questList,
						mode: "insensitive",
					},
				});
			}
		}

		if (req.query.character) {
			const charName = String(req.query.character);

			if (isScenesSelected) {
				// Special logic for Scenes: Find specific files where this NPC speaks to bring the whole conversation
				const voiceMap: Record<string, string> = {
					Adielle: "DG04AdielleVoice",
					Barni: "DG04BarniVoice",
					Thruzar: "DG04ThruzarVoice",
					Inigo: "Inigofollowervoice",
					Gore: "HD1GoreVoice",
					Kaidan: "KaiVoice",
					Lucien: "JRLucienVoice",
					Delphine: "FemaleUniqueDelphine",
					Esbern: "MaleUniqueEsbern",
					Sven: "MaleYoungEager",
					Delvin: "MaleUniqueDelvinMallory",
					Galmar: "MaleUniqueGalmar",
					Astrid: "FemaleUniqueAstrid",
					Lydia: "FemaleEvenToned",
					Serana: "DLC1SeranaVoice",
					Brynjolf: "MaleUniqueBrynjolf",
					Aela: "FemaleCommander",
					Narri: "FemaleSultry",
				};

				const targetVoice = voiceMap[charName];

				if (targetVoice) {
					// Find all fileNames where this voiceType appears in SceneDialogue files
					const matchingFiles = await prisma.dialogue.findMany({
						where: {
							fileName: { startsWith: "SceneDialogue" },
							voiceType: targetVoice,
						},
						select: { fileName: true },
						distinct: ["fileName"],
					});

					const fileList = matchingFiles
						.map((f) => f.fileName)
						.filter(Boolean) as string[];

					if (fileList.length > 0) {
						andConditions.push({
							fileName: {
								in: fileList,
							},
						});
					} else {
						// Fallback: search for NPC name in text if no files found
						andConditions.push({
							OR: [
								{
									topicText: {
										contains: charName,
										mode: "insensitive",
									},
								},
								{
									responseText: {
										contains: charName,
										mode: "insensitive",
									},
								},
							],
						});
					}
				} else {
					// Fallback: search for NPC name in text
					andConditions.push({
						OR: [
							{
								topicText: {
									contains: charName,
									mode: "insensitive",
								},
							},
							{
								responseText: {
									contains: charName,
									mode: "insensitive",
								},
							},
						],
					});
				}
			} else {
				// Standard character filtering
				const charGroups: Record<string, string[]> = {
					Adielle: [
						"DG04BjornAdielleFollowQuest",
						"DG04BjornAdielleFriendQuest",
						"DG04BjornAdielleShadowQuest",
						"DG04BjornAdielleRedemptionQuest",
					],
					Barni: [
						"DG04BjornBarniFollowQuest",
						"DG04BjornBarniAdoptedQuest",
					],
					Thruzar: [
						"DG04BjornThruzarQuest",
						"DG04BjornThruzarFollowQuest",
					],
				};

				const questList = charGroups[charName];

				if (questList) {
					andConditions.push({
						questName: {
							in: questList,
							mode: "insensitive",
						},
					});
				} else {
					// Fallback: search for NPC name in text
					andConditions.push({
						OR: [
							{
								topicText: {
									contains: charName,
									mode: "insensitive",
								},
							},
							{
								responseText: {
									contains: charName,
									mode: "insensitive",
								},
							},
						],
					});
				}
			}
		}

		if (context) {
			const contextMapping: Record<string, string[]> = {
				Friendship: ["DG04BjornFriendQuest"],
				Marriage: ["DG04BjornMarriageQuest"],
				Moods: ["DG04BjornBadMoodQuest"],
				Cold: ["DG04BjornColdQuest"],
				Blood: ["DG04BjornBloodQuest"],
			};

			const questList = contextMapping[String(context)];
			if (questList) {
				andConditions.push({
					questName: {
						in: questList,
						mode: "insensitive",
					},
				});
			}
		}

		if (andConditions.length > 0) {
			where.AND = andConditions;
		}

		const sortOrder: any[] = isScenesSelected
			? [{ fileName: "asc" }, { topicInfo: "asc" }]
			: [{ topicInfo: "asc" }, { fileName: "asc" }];

		const [dialogues, total] = await prisma.$transaction([
			prisma.dialogue.findMany({
				where,
				skip,
				take: Number(limit),
				orderBy: sortOrder,
			}),
			prisma.dialogue.count({ where }),
		]);

		res.json({
			data: dialogues,
			pagination: {
				total,
				page: Number(page),
				pages: Math.ceil(total / Number(limit)),
			},
		});
	} catch (error) {
		console.error("Fetch dialogues error:", error);
		res.status(500).json({ error: "Failed to fetch dialogues" });
	}
};

// GET scene dialogues
export const getScenes = async (req: Request, res: Response) => {
	const { page = 1, limit = 10, search, voiceType, subtype } = req.query;
	const skip = (Number(page) - 1) * Number(limit);

	const where: Prisma.DialogueWhereInput = {};

	if (search) {
		where.OR = [
			{ topicText: { contains: String(search), mode: "insensitive" } },
			{ responseText: { contains: String(search), mode: "insensitive" } },
		];
	}

	if (voiceType) {
		where.voiceType = String(voiceType);
	}

	if (subtype) {
		where.subtype = String(subtype);
	}

	try {
		const [scenes, total] = await prisma.$transaction([
			prisma.dialogue.findMany({
				where,
				skip,
				take: Number(limit),
				orderBy: [{ questName: "asc" }, { fileName: "asc" }],
			}),
			prisma.dialogue.count({ where }),
		]);

		res.json({
			data: scenes,
			pagination: {
				total,
				page: Number(page),
				pages: Math.ceil(total / Number(limit)),
			},
		});
	} catch (error) {
		console.error("Fetch scenes error:", error);
		res.status(500).json({ error: "Failed to fetch scenes" });
	}
};

// CREATE dialogue (Admin)
export const createDialogue = async (req: Request, res: Response) => {
	const { topicText, responseText, audioFileName } = req.body;

	if (!topicText || !responseText || !audioFileName) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		const newDialogue = await prisma.dialogue.create({
			data: {
				topicText,
				responseText,
				audioFileName,
				voiceType: "DG04BjornVoice", // Defaulting to Bjorn
				fileName: "ManualEntry", // Placeholder
			},
		});
		res.status(201).json(newDialogue);
	} catch (error) {
		console.error("Create dialogue error:", error);
		res.status(500).json({ error: "Failed to create dialogue" });
	}
};

// DELETE dialogue (Admin)
export const deleteDialogue = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await prisma.dialogue.delete({
			where: { id: String(id) },
		});
		res.json({ message: "Dialogue deleted successfully" });
	} catch (error) {
		console.error("Delete dialogue error:", error);
		res.status(500).json({ error: "Failed to delete dialogue" });
	}
};
