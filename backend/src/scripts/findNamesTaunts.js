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

		// Search for names
		const nameQuests = await prisma.dialogue.findMany({
			where: {
				OR: [
					{ questName: { contains: "Name", mode: "insensitive" } },
					{ fileName: { contains: "Name", mode: "insensitive" } },
				],
			},
			select: { questName: true, fileName: true },
			distinct: ["questName", "fileName"],
		});

		console.log("Potential Name Quests/Files:");
		console.log(JSON.stringify(nameQuests, null, 2));

		// Search for taunts
		const tauntQuests = await prisma.dialogue.findMany({
			where: {
				OR: [
					{ questName: { contains: "Taunt", mode: "insensitive" } },
					{ fileName: { contains: "Taunt", mode: "insensitive" } },
				],
			},
			select: { questName: true, fileName: true },
			distinct: ["questName", "fileName"],
		});

		console.log("\nPotential Taunt Quests/Files:");
		console.log(JSON.stringify(tauntQuests, null, 2));
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
