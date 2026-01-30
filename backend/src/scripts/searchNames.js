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

		const namesResults = await prisma.dialogue.findMany({
			where: {
				OR: [
					{
						topicText: {
							contains: "Bjorn, call me",
							mode: "insensitive",
						},
					},
					{ topicText: { contains: "Call me", mode: "insensitive" } },
					{ topicText: { contains: "name", mode: "insensitive" } },
					{ responseText: { contains: "Aela", mode: "insensitive" } }, // Example name he might say
					{
						responseText: {
							contains: "Lydia",
							mode: "insensitive",
						},
					},
				],
			},
			select: {
				topicText: true,
				responseText: true,
				questName: true,
				fileName: true,
			},
			distinct: ["topicText", "questName"],
		});

		console.log("Potential Name related dialogues:");
		namesResults.slice(0, 50).forEach((r) => {
			console.log(
				`Q: ${r.questName} | T: ${r.topicText}\nR: ${r.responseText}\n---`,
			);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
