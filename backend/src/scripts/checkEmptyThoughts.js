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

		const emptyThoughts = await prisma.dialogue.findMany({
			where: {
				questName: {
					in: ["DG04BjornThinkQuest", "DG04BjornFriendQuest"],
					mode: "insensitive",
				},
				OR: [
					{ topicText: { equals: "" } },
					{ topicText: { equals: null } },
				],
			},
		});

		console.log(
			`Found ${emptyThoughts.length} Thoughts with empty/null topicText.`,
		);
		if (emptyThoughts.length > 0) {
			console.log("Sample:", emptyThoughts[0]);
		}
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
