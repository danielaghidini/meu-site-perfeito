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

		const samples = await prisma.dialogue.findMany({
			where: { subtype: "Custom" },
			take: 30,
			select: { topicText: true, responseText: true, questName: true },
		});

		console.log("Custom samples:");
		samples.forEach((s) => {
			console.log(
				`- [${s.questName}] T: ${s.topicText} | R: ${s.responseText.substring(0, 100)}`,
			);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
