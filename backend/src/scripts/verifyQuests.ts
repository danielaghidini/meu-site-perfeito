import { prisma } from "../db.js";

async function main() {
	console.log("Checking Quests in DB...");
	const count = await prisma.quest.count();
	console.log(`Total Quests: ${count}`);

	if (count > 0) {
		const quests = await prisma.quest.findMany({
			select: { title: true, slug: true, category: true },
		});
		console.log("Quests found:", quests);
	} else {
		console.log("No quests found in database.");
	}
}

main()
	.catch((e) => console.error(e))
	.finally(async () => await prisma.$disconnect());
