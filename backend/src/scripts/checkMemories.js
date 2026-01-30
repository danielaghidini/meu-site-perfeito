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

		const phrase = "===MEMORIES===";

		const count = await prisma.dialogue.count({
			where: {
				OR: [
					{ topicText: { contains: phrase } },
					{ responseText: { contains: phrase } },
				],
			},
		});

		console.log(`Found ${count} records with the phrase: "${phrase}"`);

		if (count > 0) {
			const sample = await prisma.dialogue.findFirst({
				where: {
					OR: [
						{ topicText: { contains: phrase } },
						{ responseText: { contains: phrase } },
					],
				},
			});
			console.log("Sample:", sample);
		}
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
