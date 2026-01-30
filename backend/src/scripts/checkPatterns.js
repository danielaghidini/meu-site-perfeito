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

		const phrase = "===";

		const dialogues = await prisma.dialogue.findMany({
			where: {
				OR: [
					{ topicText: { contains: phrase } },
					{ responseText: { contains: phrase } },
				],
			},
			select: {
				topicText: true,
				responseText: true,
			},
		});

		console.log(`Found ${dialogues.length} records containing "==="`);

		// Extract unique content to see what kind of headers we have
		const uniqueMatches = new Set();
		dialogues.forEach((d) => {
			if (d.topicText && d.topicText.includes("==="))
				uniqueMatches.add(d.topicText);
			if (d.responseText && d.responseText.includes("==="))
				uniqueMatches.add(d.responseText);
		});

		console.log("Unique matches found:");
		uniqueMatches.forEach((m) => console.log(`- ${m}`));
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
