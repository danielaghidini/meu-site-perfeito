import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const FB_APP_ID = process.env.FB_APP_ID;
export const FB_APP_SECRET = process.env.FB_APP_SECRET;

if (!JWT_SECRET) {
	console.error(
		"Config: CRITICAL ERROR: JWT_SECRET is not defined in environment variables!",
	);
}
console.log("Config: FB_APP_ID loaded:", FB_APP_ID ? "Yes" : "No");
