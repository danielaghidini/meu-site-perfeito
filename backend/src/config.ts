import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET =
	process.env.JWT_SECRET || "site_perfeito_secret_local_dev_123";

console.log("Config: JWT_SECRET loaded. Length:", JWT_SECRET.length);
if (JWT_SECRET === "site_perfeito_secret_local_dev_123") {
	console.warn(
		"Config: WARNING: Using fallback JWT_SECRET. Check your environment variables!",
	);
}
