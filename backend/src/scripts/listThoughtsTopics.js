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

		const topics = await prisma.dialogue.findMany({
			where: {
				questName: {
					in: ["DG04BjornThinkQuest", "DG04BjornFriendQuest"],
					mode: "insensitive",
				},
			},
			select: { topicText: true },
			distinct: ["topicText"],
		});

		console.log("Found topics:");
		topics.forEach((t) => console.log(`- "${t.topicText}"`));
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
