import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonDir = path.join(
	__dirname,
	"../../../frontend/src/assets/json-export-creationkit",
);

async function analyze() {
	const files = fs.readdirSync(jsonDir).filter((f) => f.endsWith(".json"));

	let voiceCounts = {};
	let uniqueResponsesPerVoice = {};
	let questCounts = {};

	files.forEach((file) => {
		const filePath = path.join(jsonDir, file);
		const fileContent = fs.readFileSync(filePath, "utf8");
		if (!fileContent || fileContent.trim() === "") return;

		const content = JSON.parse(fileContent);

		content.forEach((entry) => {
			const vt = entry.voice_type || "Unknown";
			voiceCounts[vt] = (voiceCounts[vt] || 0) + 1;

			if (!uniqueResponsesPerVoice[vt])
				uniqueResponsesPerVoice[vt] = new Set();
			uniqueResponsesPerVoice[vt].add(entry.response_text);

			const q = entry.quest || "Unknown";
			questCounts[q] = (questCounts[q] || 0) + 1;
		});
	});

	console.log("=== Voice Type Breakdown ===");
	Object.entries(voiceCounts)
		.sort((a, b) => b[1] - a[1])
		.forEach(([voice, count]) => {
			console.log(
				`${voice}: ${count} lines (${uniqueResponsesPerVoice[voice].size} unique)`,
			);
		});

	console.log("\n=== Quest Breakdown (Top 20) ===");
	Object.entries(questCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 20)
		.forEach(([quest, count]) => {
			console.log(`${quest}: ${count} lines`);
		});
}

analyze().catch((err) => console.error(err));
