import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function clearMetrics() {
	console.log("Cleaning up access logs...");
	try {
		const deleted = await prisma.accessLog.deleteMany({});
		console.log(`Successfully deleted ${deleted.count} access logs.`);
	} catch (error) {
		console.error("Error clearing metrics:", error);
	} finally {
		await prisma.$disconnect();
	}
}

clearMetrics();
