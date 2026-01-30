import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const targets = [
	"Sven",
	"Narri",
	"Aela",
	"Lydia",
	"Inigo",
	"Serana",
	"Astrid",
	"Delvin",
	"Esbern",
	"Cicero",
	"Mjoll",
	"Karliah",
	"Brynjolf",
	"Paarthurnax",
	"Alduin",
	"Ulfric",
	"Tullius",
	"Elenwen",
];

async function main() {
	try {
		await prisma.$connect();

		console.log("NPC Mention Counts:");
		const results = {};

		for (const name of targets) {
			const count = await prisma.dialogue.count({
				where: {
					OR: [
						{
							responseText: {
								contains: name,
								mode: "insensitive",
							},
						},
						{ topicText: { contains: name, mode: "insensitive" } },
					],
				},
			});
			if (count > 0) results[name] = count;
		}

		const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
		console.log(JSON.stringify(sorted, null, 2));
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
