import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
	try {
		await prisma.$connect();
		const records = await prisma.dialogue.findMany({
			take: 10,
			where: {
				voiceType: "DG04BjornVoice",
				audioFileName: { not: null },
			},
		});
		console.log(
			"Found records with audioFileName:",
			JSON.stringify(records, null, 2),
		);

		const totalWithAudio = await prisma.dialogue.count({
			where: { audioFileName: { not: null } },
		});
		console.log("Total records with audioFileName:", totalWithAudio);
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

check();
