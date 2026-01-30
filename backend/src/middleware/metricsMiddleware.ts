import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_key";

export const metricsMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// 1. Only track GET requests (page views/content fetches)
	// 2. Skip metrics API, health checks, static files, and technical auth checks
	if (
		req.method !== "GET" ||
		req.path.startsWith("/api/admin/metrics") ||
		req.path.startsWith("/api/health") ||
		req.path.startsWith("/auth/me") ||
		req.path.includes(".")
	) {
		return next();
	}

	// Try to identify user but don't block
	try {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1];
		let user: any = null;

		if (token) {
			try {
				user = jwt.verify(token, JWT_SECRET);
			} catch (e) {
				// Invalid token, ignore
			}
		}

		// skip logging if user is ADMIN
		if (user?.role === "ADMIN") {
			return next();
		}

		prisma.accessLog
			.create({
				data: {
					path: req.path,
					method: req.method,
					referer: req.get("referer"),
					userAgent: req.get("user-agent"),
					userId: user?.id || null,
				},
			})
			.catch((err: any) =>
				console.error("Error creating access log:", err),
			);
	} catch (error) {
		// Silent error for metrics to not disrupt user experience
		console.error("Metrics middleware error:", error);
	}

	next();
};
