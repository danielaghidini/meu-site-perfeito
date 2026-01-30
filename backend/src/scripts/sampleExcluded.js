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

		const excluded = await prisma.dialogue.findMany({
			where: {
				questName: {
					in: ["DG04BjornThinkQuest", "DG04BjornFriendQuest"],
					mode: "insensitive",
				},
				NOT: {
					topicText: {
						in: [
							"What's on your mind?",
							"What are you thinking about?",
						],
						mode: "insensitive",
					},
				},
			},
			take: 20,
			select: { topicText: true, responseText: true },
		});

		console.log(
			"Sample of dialogues excluded by the current strict filter:",
		);
		excluded.forEach((e) => {
			console.log(`P: ${e.topicText}\nB: ${e.responseText}\n---`);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
