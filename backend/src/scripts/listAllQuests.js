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

		const quests = await prisma.dialogue.groupBy({
			by: ["questName"],
			_count: {
				_all: true,
			},
		});

		console.log("All unique quests and counts:");
		quests.forEach((q) => {
			console.log(`- [${q._count._all}] ${q.questName}`);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
