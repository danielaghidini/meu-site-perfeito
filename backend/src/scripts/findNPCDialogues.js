import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
	"Jarl",
];

async function main() {
	try {
		await prisma.$connect();

		console.log("Analyzing NPC-related dialogues...");

		for (const npc of npcs) {
			const count = await prisma.dialogue.count({
				where: {
					OR: [
						{
							responseText: {
								contains: npc,
								mode: "insensitive",
							},
						},
						{ topicText: { contains: npc, mode: "insensitive" } },
					],
				},
			});
			console.log(`- ${npc}: ${count} dialogues found`);
		}

		// Sample some "Aela" dialogues
		const aelaSamples = await prisma.dialogue.findMany({
			where: {
				OR: [
					{ responseText: { contains: "Aela", mode: "insensitive" } },
					{ topicText: { contains: "Aela", mode: "insensitive" } },
				],
			},
			take: 5,
			select: { responseText: true, questName: true },
		});
		console.log("\nAela Samples:");
		aelaSamples.forEach((s) =>
			console.log(`- [${s.questName}] ${s.responseText}`),
		);
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
