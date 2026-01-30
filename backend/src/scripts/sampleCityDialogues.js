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

		const whiterunSamples = await prisma.dialogue.findMany({
			where: {
				OR: [
					{
						questName: {
							contains: "Whiterun",
							mode: "insensitive",
						},
					},
					{ fileName: { contains: "Whiterun", mode: "insensitive" } },
					{
						responseText: {
							contains: "Whiterun",
							mode: "insensitive",
						},
					},
				],
			},
			take: 20,
			select: {
				questName: true,
				fileName: true,
				responseText: true,
				topicText: true,
				subtype: true,
			},
		});

		console.log("Whiterun Samples:");
		whiterunSamples.forEach((r) => {
			console.log(
				`Q: ${r.questName} | S: ${r.subtype}\nT: ${r.topicText}\nR: ${r.responseText}\nF: ${r.fileName}\n---`,
			);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
