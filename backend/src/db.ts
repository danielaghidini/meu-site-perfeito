import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

console.log("Initializing Prisma Client...");

export const prisma = new PrismaClient();

export const connectDB = async () => {
	try {
		await prisma.$connect();
		console.log("Successfully connected to the database");
	} catch (err) {
		console.error("Failed to connect to the database:", err);
		// Don't throw, let the app try to run or fail on first query
	}
};
