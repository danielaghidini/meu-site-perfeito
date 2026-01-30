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

		const variations = await prisma.dialogue.findMany({
			where: {
				OR: [
					{
						topicText: {
							contains: "on your mind",
							mode: "insensitive",
						},
					},
					{
						topicText: {
							contains: "thinking about",
							mode: "insensitive",
						},
					},
				],
			},
			select: { topicText: true },
		});

		const counts = {};
		variations.forEach((r) => {
			const topic = r.topicText || "NULL";
			counts[topic] = (counts[topic] || 0) + 1;
		});

		console.log("Variations found in the whole database:");
		console.log(JSON.stringify(counts, null, 2));
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
