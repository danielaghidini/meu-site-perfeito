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

		// Fetch a sample of scenes
		const scenes = await prisma.dialogue.findMany({
			where: {
				fileName: {
					startsWith: "SceneDialogue_",
				},
			},
			take: 20,
			select: {
				id: true,
				questName: true,
				voiceType: true,
				responseText: true,
				fileName: true,
			},
			orderBy: {
				fileName: "asc", // Check if sorting by filename groups them
			},
		});

		console.log("Sample Scenes:", JSON.stringify(scenes, null, 2));
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
