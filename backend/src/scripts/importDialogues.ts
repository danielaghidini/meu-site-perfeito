import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import fs from "fs";
import path from "path";

console.log("DATABASE_URL:", process.env.DATABASE_URL);
const prisma = new PrismaClient();

const IMPORT_DIR =
	"c:\\Projetos\\Bjorn-Wiki\\bjorn-skyrim-wiki\\frontend\\src\\assets\\json-export-creationkit";

async function main() {
	try {
		await prisma.$connect();
		console.log("Successfully connected to database");
	} catch (e) {
		console.error("Connection failed:", e);
		process.exit(1);
	}

	console.log(`Searching for files in: ${IMPORT_DIR}`);

	if (!fs.existsSync(IMPORT_DIR)) {
		console.error("Directory not found!");
		process.exit(1);
	}

	const files = fs.readdirSync(IMPORT_DIR).filter((f) => f.endsWith(".json"));
	console.log(`Found ${files.length} JSON files to import.`);

	let totalImported = 0;

	for (const file of files) {
		const filePath = path.join(IMPORT_DIR, file);
		const content = fs.readFileSync(filePath, "utf-8");

		try {
			const data = JSON.parse(content);

			if (!Array.isArray(data)) {
				console.warn(`Skipping ${file}: Content is not an array.`);
				continue;
			}

			// Map to Prisma model
			const dialogueEntries = data
				.map((item: any) => ({
					voiceType: item.voice_type,
					questName: item.quest,
					branch: item.branch,
					topicText: item.topic_text,
					responseText: item.response_text,
					emotion: item.emotion,
					fileName: item.full_path
						? path.basename(item.full_path)
						: null,
				}))
				.filter((d) => d.responseText); // Ensure response text exists

			if (dialogueEntries.length > 0) {
				await prisma.dialogue.createMany({
					data: dialogueEntries,
				});
				console.log(
					`Imported ${dialogueEntries.length} entries from ${file}`,
				);
				totalImported += dialogueEntries.length;
			}
		} catch (error) {
			console.error(`Error processing ${file}:`, error);
		}
	}

	console.log(
		`\nImport complete! Total dialogues imported: ${totalImported}`,
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
