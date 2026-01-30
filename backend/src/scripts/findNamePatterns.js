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

		const namesResults = await prisma.dialogue.findMany({
			where: {
				topicText: { contains: "My name is", mode: "insensitive" },
			},
			select: { topicText: true, questName: true },
			distinct: ["topicText"],
		});

		console.log(
			`Found ${namesResults.length} unique topics with "My name is":`,
		);
		namesResults
			.slice(0, 20)
			.forEach((r) => console.log(`- "${r.topicText}" (${r.questName})`));

		const callMeResults = await prisma.dialogue.findMany({
			where: {
				topicText: { contains: "Call me", mode: "insensitive" },
			},
			select: { topicText: true, questName: true },
			distinct: ["topicText"],
		});

		console.log(
			`\nFound ${callMeResults.length} unique topics with "Call me":`,
		);
		callMeResults
			.slice(0, 20)
			.forEach((r) => console.log(`- "${r.topicText}" (${r.questName})`));
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
