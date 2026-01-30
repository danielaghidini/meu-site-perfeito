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

		const commands = ["trade", "carry", "wait", "follow", "favor"];
		for (const cmd of commands) {
			const count = await prisma.dialogue.count({
				where: {
					topicText: { contains: cmd, mode: "insensitive" },
				},
			});
			console.log(`- ${cmd}: ${count}`);
		}
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
