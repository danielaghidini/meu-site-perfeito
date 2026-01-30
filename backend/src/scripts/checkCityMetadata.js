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

		console.log("Checking metadata for city patterns...");

		for (const city of cities) {
			const questMatches = await prisma.dialogue.groupBy({
				by: ["questName"],
				where: {
					OR: [
						{ questName: { contains: city, mode: "insensitive" } },
						{ fileName: { contains: city, mode: "insensitive" } },
					],
				},
				_count: { _all: true },
			});

			if (questMatches.length > 0) {
				console.log(`\nCity: ${city}`);
				questMatches.forEach((m) => {
					console.log(
						`- Quest: ${m.questName} (${m._count._all} matches)`,
					);
				});
			}
		}
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
