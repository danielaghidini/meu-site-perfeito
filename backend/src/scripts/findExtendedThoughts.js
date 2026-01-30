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
			where: {
				OR: [
					{ topicText: { contains: "think", mode: "insensitive" } },
					{ topicText: { contains: "mind", mode: "insensitive" } },
					{ topicText: { contains: "opinion", mode: "insensitive" } },
					{ topicText: { contains: "feel", mode: "insensitive" } },
					{ topicText: { contains: "about", mode: "insensitive" } },
					{ questName: { contains: "Think", mode: "insensitive" } },
					{ questName: { contains: "Friend", mode: "insensitive" } },
				],
			},
			select: { topicText: true, questName: true },
		});

		const counts = {};
		records.forEach((r) => {
			if (!r.topicText) return;
			counts[r.topicText] = (counts[r.topicText] || 0) + 1;
		});

		const sortedTopics = Object.entries(counts).sort((a, b) => b[1] - a[1]);

		console.log(
			`Potential "Thoughts" topics (total records: ${records.length}):`,
		);
		sortedTopics.slice(0, 50).forEach(([topic, count]) => {
			console.log(`- [${count}] "${topic}"`);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
