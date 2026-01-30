import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	try {
		await prisma.$connect();

		console.log("Analyzing DG04BjornNPCModsQuest...");

		const dialogues = await prisma.dialogue.findMany({
			where: {
				questName: "DG04BjornNPCModsQuest",
			},
			select: {
				topicText: true,
				responseText: true,
			},
		});

		const npcs = [
			"Sven",
			"Narri",
			"Aela",
			"Mjoll",
			"Serana",
			"Lydia",
			"Farkas",
			"Vilkas",
			"Kodlak",
			"Saadia",
			"Uthgerd",
			"Inigo",
			"Lucien",
			"Auri",
			"Remiel",
			"Xelzaz",
		];
		const counts = {};

		for (const npc of npcs) {
			const count = dialogues.filter(
				(d) =>
					(d.topicText &&
						d.topicText
							.toLowerCase()
							.includes(npc.toLowerCase())) ||
					(d.responseText &&
						d.responseText
							.toLowerCase()
							.includes(npc.toLowerCase())),
			).length;
			if (count > 0) counts[npc] = count;
		}

		console.log("NPC Mentions in NPCModsQuest:");
		console.log(JSON.stringify(counts, null, 2));

		// Sample some dialogues
		console.log("\nSample Topics from NPCModsQuest:");
		dialogues
			.slice(0, 15)
			.forEach((d) =>
				console.log(
					`- T: ${d.topicText} | R: ${d.responseText.substring(0, 50)}...`,
				),
			);
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
