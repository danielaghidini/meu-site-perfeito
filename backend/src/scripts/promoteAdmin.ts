import { prisma } from "../db.js";

async function promoteUser(email: string) {
	try {
		const user = await prisma.user.update({
			where: { email },
			data: { role: "ADMIN" },
		});
		console.log(`Successfully promoted ${user.email} to ADMIN! 🛡️`);
	} catch (error) {
		console.error(
			`Error promoting user: ${error instanceof Error ? error.message : String(error)}`,
		);
	} finally {
		await prisma.$disconnect();
	}
}

const email = process.argv[2];
if (!email) {
	console.log("Usage: npx tsx src/scripts/promoteAdmin.ts user@example.com");
	process.exit(1);
}

promoteUser(email);
