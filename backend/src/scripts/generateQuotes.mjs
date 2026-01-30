import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonDir = path.join(
	__dirname,
	"../../../frontend/src/assets/json-export-creationkit",
);

const extractQuotes = () => {
	const files = fs
		.readdirSync(jsonDir)
		.filter(
			(f) =>
				f.endsWith(".json") &&
				(f.includes("BjornFriendQuest") ||
					f.includes("BjornFollowQuest") ||
					f.includes("BjornBardDialogue")),
		);
	let quotes = new Set();

	files.forEach((file) => {
		const content = JSON.parse(
			fs.readFileSync(path.join(jsonDir, file), "utf8"),
		);
		content.forEach((entry) => {
			if (
				entry.voice_type === "DG04BjornVoice" &&
				entry.response_text &&
				entry.response_text.length > 20
			) {
				quotes.add(entry.response_text.trim());
			}
		});
	});

	const quotesArray = Array.from(quotes).slice(0, 100);
	console.log(
		quotesArray.map((q) => `"${q.replace(/"/g, '\\"')}"`).join("\n"),
	);
};

extractQuotes();
