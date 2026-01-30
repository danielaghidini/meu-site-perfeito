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

		const records = await prisma.dialogue.findMany({
			where: { questName: "DG04BjornPlayersQuest" },
			select: { topicText: true },
		});

		const counts = {};
		records.forEach((r) => {
			const topic = r.topicText || "NULL";
			counts[topic] = (counts[topic] || 0) + 1;
		});

		const sortedTopics = Object.entries(counts).sort((a, b) => b[1] - a[1]);

		console.log(
			`Unique topics in DG04BjornPlayersQuest (${records.length} records):`,
		);
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
