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

		const targetText =
			"I'm going to sell them, sorry... I need the gold for some things.";

		const count = await prisma.dialogue.count({
			where: {
				topicText: targetText,
			},
		});

		console.log(`Found ${count} records matching the text.`);

		if (count > 0) {
			const deleteResult = await prisma.dialogue.deleteMany({
				where: {
					topicText: targetText,
				},
			});
			console.log(`Deleted ${deleteResult.count} records.`);
		}
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
