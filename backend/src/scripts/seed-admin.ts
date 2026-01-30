import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
	const email = "admin@admin.com";
	const password = "admin";
	const name = "Administrador Mastter";

	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		console.log("User already exists");
		return;
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
			role: "ADMIN",
		},
	});

	console.log(`Admin user created: ${user.email}`);
	console.log(`Password: ${password}`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
