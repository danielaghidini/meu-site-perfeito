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

		const dialogues = await prisma.dialogue.findMany({
			where: {
				topicText: { contains: "think of", mode: "insensitive" },
			},
			select: {
				topicText: true,
				questName: true,
			},
			distinct: ["topicText"],
		});

		console.log("NPC Opinion topics found:");
		dialogues.forEach((d) => {
			console.log(`- ${d.topicText} [${d.questName}]`);
		});

		const questOpinions = await prisma.dialogue.findMany({
			where: {
				questName: "DG04BjornNPCModsQuest",
			},
			select: {
				topicText: true,
			},
			distinct: ["topicText"],
		});
		console.log("\nNPCModsQuest Topics:");
		questOpinions.forEach((d) => {
			if (d.topicText) console.log(`- ${d.topicText}`);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
