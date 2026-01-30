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

		const questNames = ["DG04BjornThinkQuest", "DG04BjornFriendQuest"];

		const records = await prisma.dialogue.findMany({
			where: {
				questName: { in: questNames, mode: "insensitive" },
			},
			select: { topicText: true },
		});

		const counts = {};
		records.forEach((r) => {
			const topic = r.topicText || "NULL/EMPTY";
			counts[topic] = (counts[topic] || 0) + 1;
		});

		const sortedTopics = Object.entries(counts).sort((a, b) => b[1] - a[1]);

		console.log(`Total records in Thoughts quests: ${records.length}\n`);
		console.log("Unique topics and counts:");
		sortedTopics.forEach(([topic, count]) => {
			console.log(`- [${count}] "${topic}"`);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
