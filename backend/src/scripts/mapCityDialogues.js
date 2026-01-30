import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const locations = [
	"Whiterun",
	"Solitude",
	"Windhelm",
	"Markarth",
	"Riften",
	"Morthal",
	"Dawnstar",
	"Falkreath",
	"Winterhold",
	"Riverwood",
	"Ivarstead",
	"Rorikstead",
	"Dragon Bridge",
];

async function main() {
	try {
		await prisma.$connect();

		console.log("Mapping locations to dialogue counts:");

		const mapping = {};

		for (const loc of locations) {
			const results = await prisma.dialogue.count({
				where: {
					OR: [
						{
							responseText: {
								contains: loc,
								mode: "insensitive",
							},
						},
						{ topicText: { contains: loc, mode: "insensitive" } },
					],
				},
			});
			mapping[loc] = results;
		}

		console.log(JSON.stringify(mapping, null, 2));

		// Sample some "Falkreath" dialogues since they were the most numerous
		const falkreathSamples = await prisma.dialogue.findMany({
			where: {
				OR: [
					{
						responseText: {
							contains: "Falkreath",
							mode: "insensitive",
						},
					},
					{
						topicText: {
							contains: "Falkreath",
							mode: "insensitive",
						},
					},
				],
			},
			take: 5,
			select: { responseText: true },
		});
		console.log("\nFalkreath Samples:");
		falkreathSamples.forEach((s) => console.log(`- ${s.responseText}`));
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
