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

		const emotions = await prisma.dialogue.groupBy({
			by: ["emotion"],
			_count: {
				_all: true,
			},
		});

		console.log("Emotions and counts:");
		emotions.forEach((e) => {
			console.log(`- [${e._count._all}] ${e.emotion || "NULL"}`);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
