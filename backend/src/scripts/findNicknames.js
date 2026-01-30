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

		const nicknameResults = await prisma.dialogue.findMany({
			where: {
				OR: [
					{
						topicText: {
							contains: "nickname",
							mode: "insensitive",
						},
					},
					{
						responseText: {
							contains: "nickname",
							mode: "insensitive",
						},
					},
					{
						questName: {
							contains: "nickname",
							mode: "insensitive",
						},
					},
					{
						topicText: {
							contains: "call you",
							mode: "insensitive",
						},
					},
					{
						responseText: {
							contains: "call you",
							mode: "insensitive",
						},
					},
				],
			},
			select: { topicText: true, responseText: true, questName: true },
		});

		console.log(
			`Found ${nicknameResults.length} records related to nicknames:`,
		);
		nicknameResults.slice(0, 30).forEach((r) => {
			console.log(
				`- Q: ${r.questName} | T: ${r.topicText}\n  R: ${r.responseText}\n---`,
			);
		});
	} catch (e) {
		console.error(e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
