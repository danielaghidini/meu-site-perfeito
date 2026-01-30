import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const cities = [
	"Whiterun",
	"Solitude",
	"Windhelm",
	"Markarth",
	"Riften",
	"Morthal",
	"Dawnstar",
	"Falkreath",
	"Winterhold",
];

async function main() {
	try {
		await prisma.$connect();

		console.log("Analyzing city-related dialogues...");

		for (const city of cities) {
			const count = await prisma.dialogue.count({
				where: {
					OR: [
						{ questName: { contains: city, mode: "insensitive" } },
						{ fileName: { contains: city, mode: "insensitive" } },
						{
							responseText: {
								contains: city,
								mode: "insensitive",
							},
						},
					],
				},
			});
			console.log(`- ${city}: ${count} dialogues found`);
		}

		// Sample some quests that might be city-specific but don't have the city name in them
		const sampleQuests = await prisma.dialogue.findMany({
			select: { questName: true },
			distinct: ["questName"],
			take: 20,
		});
		console.log("\nSample quest names for city identification:");
		sampleQuests.forEach((q) => console.log(`- ${q.questName}`));
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
