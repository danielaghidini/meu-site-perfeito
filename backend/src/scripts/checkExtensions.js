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
			take: 20,
			where: {
				voiceType: "DG04BjornVoice",
				audioFileName: { not: null },
			},
			select: { audioFileName: true },
		});

		console.log("Audio extensions in DB:");
		records.forEach((r) => {
			const ext = r.audioFileName.split(".").pop();
			console.log(`- ${r.audioFileName} (ext: ${ext})`);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

check();
