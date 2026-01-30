import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateExtensions() {
	try {
		await prisma.$connect();
		console.log("Connected to database. Starting extension update...");

		// Fetch all dialogues with audioFileName
		const dialogues = await prisma.dialogue.findMany({
			where: {
				audioFileName: {
					not: null,
				},
			},
			select: {
				id: true,
				audioFileName: true,
			},
		});

		console.log(`Found ${dialogues.length} dialogues to check.`);

		let updatedCount = 0;
		for (const dialogue of dialogues) {
			if (dialogue.audioFileName.match(/\.(xwm|fuz)$/i)) {
				const newFileName = dialogue.audioFileName.replace(
					/\.(xwm|fuz)$/i,
					".wav",
				);
				await prisma.dialogue.update({
					where: { id: dialogue.id },
					data: { audioFileName: newFileName },
				});
				updatedCount++;
			}
		}

		console.log(`Successfully updated ${updatedCount} extensions to .wav.`);
	} catch (e) {
		console.error("Error during update:", e);
	} finally {
		await prisma.$disconnect();
	}
}

updateExtensions();
