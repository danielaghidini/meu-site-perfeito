import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export interface AuthRequest extends Request {
	user?: any;
}

export const authenticateToken = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res
			.status(401)
			.json({ error: "Access denied. No token provided." });
	}

	try {
		const verified = jwt.verify(token, JWT_SECRET);
		console.log("Token verified successfully. Payload:", verified);
		req.user = verified;
		next();
	} catch (error) {
		console.error("Token verification failed:", (error as Error).message);
		res.status(403).json({ error: "Invalid token" });
	}
};

export const authorizeRole = (roles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		console.log("Checking authorization. Required roles:", roles);
		console.log("Current user in request:", req.user);

		if (!req.user || !roles.includes(req.user.role)) {
			console.warn(
				`Authorization failed for user ${req.user?.id}. Role: ${req.user?.role}`,
			);
			return res
				.status(403)
				.json({ error: "Access denied. Insufficient permissions." });
		}
		next();
	};
};

export const optionalAuthenticateToken = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return next();
	}

	try {
		const verified = jwt.verify(token, JWT_SECRET);
		req.user = verified;
		next();
	} catch (error) {
		// If token is invalid, just proceed as guest
		next();
	}
};
