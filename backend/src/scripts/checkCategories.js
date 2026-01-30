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

		// Check for Hellos
		const hellos = await prisma.dialogue.findMany({
			where: {
				OR: [
					{ questName: { contains: "Hello", mode: "insensitive" } },
					{ fileName: { contains: "Hello", mode: "insensitive" } },
					{ topicText: { contains: "Hello", mode: "insensitive" } },
				],
			},
			take: 5,
		});
		console.log(
			"Possible Hellos:",
			hellos.length > 0 ? hellos : "None found",
		);

		// Check for Idles
		const idles = await prisma.dialogue.findMany({
			where: {
				OR: [
					{ questName: { contains: "Idle", mode: "insensitive" } },
					{ fileName: { contains: "Idle", mode: "insensitive" } },
					// Idles often have no topic text or specific topic text?
					{ topicText: { equals: "" } },
				],
			},
			take: 5,
		});
		console.log("Possible Idles:", idles.length > 0 ? idles : "None found");

		// Group by QuestName to see common buckets
		const quests = await prisma.dialogue.groupBy({
			by: ["questName"],
			_count: {
				id: true,
			},
			orderBy: {
				_count: {
					id: "desc",
				},
			},
			take: 100,
		});
		console.log("Top Quests:", quests);

		// Check Hellos by filename or response
		const helloMatches = await prisma.dialogue.findMany({
			where: {
				OR: [
					{ fileName: { contains: "Hello", mode: "insensitive" } },
					{
						responseText: {
							contains: "Hello",
							mode: "insensitive",
						},
					},
				],
			},
			take: 5,
		});
		console.log(
			"Hello Matches:",
			helloMatches.length > 0 ? helloMatches : "None",
		);
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
