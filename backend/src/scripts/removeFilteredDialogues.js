import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	const PHRASE = "Sorry, I think I can get it another way.";

	try {
		await prisma.$connect();

		const count = await prisma.dialogue.count({
			where: {
				topicText: {
					contains: PHRASE,
					mode: "insensitive",
				},
			},
		});

		console.log(`Found ${count} records with the phrase: "${PHRASE}"`);

		if (count > 0) {
			const result = await prisma.dialogue.deleteMany({
				where: {
					topicText: {
						contains: PHRASE,
						mode: "insensitive",
					},
				},
			});
			console.log(`Deleted ${result.count} records.`);
		}
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
