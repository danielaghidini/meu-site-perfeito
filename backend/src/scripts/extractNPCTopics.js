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

		const dialogues = await prisma.dialogue.findMany({
			where: {
				OR: [
					{
						topicText: {
							contains: "What's your take on",
							mode: "insensitive",
						},
					},
					{
						topicText: {
							contains: "What do you think of",
							mode: "insensitive",
						},
					},
					{ topicText: { contains: "Who is", mode: "insensitive" } },
					{ topicText: { contains: " Bjorn", mode: "insensitive" } },
				],
			},
			select: {
				topicText: true,
				questName: true,
			},
		});

		console.log(
			`Found ${dialogues.length} dialogues with NPC-like topics.`,
		);

		// Count occurrences of words that might be NPC names (Capitalized words in the middle of a sentence)
		const possibleNPCs = {};
		dialogues.forEach((d) => {
			if (!d.topicText) return;
			const matches = d.topicText.match(/[A-Z][a-z]+/g);
			if (matches) {
				matches.forEach((m) => {
					if (
						[
							"What",
							"Who",
							"Bjorn",
							"Your",
							"Think",
							"Take",
							"The",
							"Is",
						].includes(m)
					)
						return;
					possibleNPCs[m] = (possibleNPCs[m] || 0) + 1;
				});
			}
		});

		const sorted = Object.entries(possibleNPCs).sort((a, b) => b[1] - a[1]);
		console.log("Top potential NPCs mentioned in topics:");
		console.log(JSON.stringify(sorted.slice(0, 30), null, 2));
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
