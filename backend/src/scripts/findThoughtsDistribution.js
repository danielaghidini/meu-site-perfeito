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

		const topics = ["What's on your mind?", "What are you thinking about?"];

		const records = await prisma.dialogue.findMany({
			where: {
				topicText: {
					in: topics,
					mode: "insensitive",
				},
			},
			select: { questName: true, topicText: true },
		});

		const counts = {};
		records.forEach((r) => {
			const key = `${r.questName} | ${r.topicText}`;
			counts[key] = (counts[key] || 0) + 1;
		});

		console.log("Distribution of Thoughts topics across quests:");
		Object.entries(counts).forEach(([key, count]) => {
			console.log(`- [${count}] ${key}`);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
