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

		const phrase = "===";

		const deleteResult = await prisma.dialogue.deleteMany({
			where: {
				OR: [
					{ topicText: { contains: phrase } },
					{ responseText: { contains: phrase } },
				],
			},
		});

		console.log(
			`Deleted ${deleteResult.count} records containing pattern: "${phrase}"`,
		);
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
