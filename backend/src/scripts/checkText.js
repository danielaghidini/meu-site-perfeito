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

		const results = await prisma.dialogue.findMany({
			where: {
				OR: [
					{ responseText: { contains: "another way" } },
					{ topicText: { contains: "another way" } },
				],
			},
			select: { id: true, responseText: true, topicText: true },
		});

		console.log("Matches found:", results);
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
