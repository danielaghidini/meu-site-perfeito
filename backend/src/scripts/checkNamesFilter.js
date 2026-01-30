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

		const count = await prisma.dialogue.count({
			where: {
				OR: [
					{
						topicText: {
							contains: "My name is",
							mode: "insensitive",
						},
					},
					{
						topicText: {
							contains: "Bjorn, call me",
							mode: "insensitive",
						},
					},
				],
			},
		});

		console.log(`Matching records for Names filter: ${count}`);
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
