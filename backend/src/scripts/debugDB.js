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

		console.log("Testing getDialogues query...");

		const subtypes = await prisma.dialogue.groupBy({
			by: ["subtype"],
			_count: { id: true },
		});
		console.log("Distinct subtypes:", subtypes);
	} catch (e) {
		console.error("Query FAILED:", e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
