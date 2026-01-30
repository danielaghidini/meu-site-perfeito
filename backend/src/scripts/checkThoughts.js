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

		// Check for Quests with "Think" or "Friend"
		const quests = await prisma.dialogue.groupBy({
			by: ["questName"],
			where: {
				OR: [
					{ questName: { contains: "Think", mode: "insensitive" } },
					{ questName: { contains: "Friend", mode: "insensitive" } },
				],
			},
			_count: { id: true },
		});
		console.log("Matching Quests:", quests);

		// Sample dialogues from these quests
		if (quests.length > 0) {
			const sample = await prisma.dialogue.findMany({
				where: {
					questName: {
						in: quests
							.map((q) => q.questName)
							.filter((n) => n !== null),
					},
				},
				take: 5,
				select: { questName: true, topicText: true, subtype: true },
			});
			console.log("Sample Dialogues:", sample);
		}
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
