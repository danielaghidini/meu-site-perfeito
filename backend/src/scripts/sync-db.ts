import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const { DATABASE_URL, DATABASE_URL_PROD } = process.env;

if (!DATABASE_URL) {
	console.error("❌ Error: DATABASE_URL is not defined in .env");
	process.exit(1);
}

if (!DATABASE_URL_PROD) {
	console.error("❌ Error: DATABASE_URL_PROD is not defined in .env");
	console.log(
		"💡 Please add DATABASE_URL_PROD='your_production_connection_string' to your .env file",
	);
	process.exit(1);
}

// Function to clean URL for CLI tools (removes schema param which psql might not like)
const cleanUrl = (connectionString: string) => {
	try {
		const url = new URL(connectionString);
		// Remove schema param as it can cause issues with psql CLI
		url.searchParams.delete("schema");
		// You might also want to delete other specific params if they cause issues, or keep them.
		// For now, let's keep others like sslmode unless they prove problematic.
		return url.toString();
	} catch (e) {
		// If fails to parse, return original (fallback)
		return connectionString;
	}
};

console.log(
	"⚠️  WARNING: This will OVERWRITE your local database with production data.",
);
console.log("Local DB:", DATABASE_URL.split("@")[1]); // Hiding credentials
console.log("Prod DB: ", DATABASE_URL_PROD.split("@")[1]); // Hiding credentials

// Simple confirmation delay
console.log("Starting sync in 3 seconds... (Ctrl+C to cancel)");
setTimeout(() => {
	try {
		console.log("🚀 Downloading and restoring data...");

		const cleanProdUrl = cleanUrl(DATABASE_URL_PROD);
		const cleanLocalUrl = cleanUrl(DATABASE_URL);

		// Uses pg_dump to pipe data directly to psql
		// -O: no owner, -x: no privileges, --clean: drop existing objects, --if-exists
		const command = `pg_dump "${cleanProdUrl}" -O -x --clean --if-exists | psql "${cleanLocalUrl}"`;

		execSync(command, { stdio: "inherit" });

		console.log("✅ Database sync completed successfully!");
	} catch (error) {
		console.error("❌ Sync failed:", error);
		process.exit(1);
	}
}, 3000);
