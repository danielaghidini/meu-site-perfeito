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

		const customResults = await prisma.dialogue.findMany({
			where: {
				subtype: "Custom",
			},
			take: 50,
			select: { topicText: true, responseText: true, questName: true },
		});

		console.log("Sample of 'Custom' subtype records:");
		customResults.forEach((r) => {
			console.log(
				`- Q: ${r.questName} | T: ${r.topicText}\n  R: ${r.responseText}\n---`,
			);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
