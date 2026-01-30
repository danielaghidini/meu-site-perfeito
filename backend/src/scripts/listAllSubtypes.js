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

		const subtypes = await prisma.dialogue.groupBy({
			by: ["subtype"],
			_count: {
				_all: true,
			},
		});

		console.log("All subtypes and counts:");
		subtypes.forEach((s) => {
			console.log(`- [${s._count._all}] ${s.subtype || "NULL"}`);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
