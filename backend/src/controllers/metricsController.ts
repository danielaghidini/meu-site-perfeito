import { Request, Response } from "express";
import { prisma } from "../db.js";

export const getMetrics = async (req: Request, res: Response) => {
	try {
		// Optional cleanup for the refinement phase
		if (req.query.clear === "true") {
			await prisma.accessLog.deleteMany({});
			return res.json({ message: "Metrics cleared" });
		}

		const totalViews = await prisma.accessLog.count();
		const totalUsers = await prisma.user.count();

		// Helper to map API paths to human-readable pages
		const mapPathToPage = (apiPath: string) => {
			if (apiPath.startsWith("/api/quests/")) return "/quests";
			if (apiPath === "/api/quests") return "/quests";
			if (apiPath === "/api/articles") return "/articles";
			if (apiPath === "/api/fan-art") return "/fan-art";
			if (apiPath === "/api/dialogues") return "/dialogues";
			if (apiPath === "/api/scenes") return "/dialogues";
			if (apiPath === "/api/chat") return "/chat";
			return apiPath;
		};

		// 1. Group by Referer
		const viewsByReferer = await prisma.accessLog.groupBy({
			by: ["referer"],
			_count: { referer: true },
			where: { referer: { not: null } },
		});

		// 2. Group by Path
		const viewsByRawPath = await prisma.accessLog.groupBy({
			by: ["path"],
			_count: { path: true },
			where: {
				OR: [
					{ referer: null },
					{ referer: "" },
					{ referer: "http://localhost:5173/" },
					{ referer: "http://localhost:3000/" },
				],
			},
		});

		const pageCounts: Record<string, number> = {};

		viewsByReferer.forEach((item) => {
			if (!item.referer) return;
			try {
				const url = new URL(item.referer);
				let p = url.pathname;
				if (p === "" || p === "/") p = "/";
				pageCounts[p] =
					(pageCounts[p] || 0) + (item._count?.referer || 0);
			} catch (e) {
				pageCounts["/"] =
					(pageCounts["/"] || 0) + (item._count?.referer || 0);
			}
		});

		viewsByRawPath.forEach((item) => {
			const p = mapPathToPage(item.path);
			pageCounts[p] = (pageCounts[p] || 0) + (item._count?.path || 0);
		});

		const cleanedViewsByPath = Object.entries(pageCounts)
			.map(([path, count]) => ({ path, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 20);

		// 3. Top Contributors
		const topContributors = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				_count: {
					select: {
						articles: true,
						quests: true,
						fanArts: true,
					},
				},
			},
			take: 20,
		});

		const contributorMetrics = topContributors
			.map((user) => ({
				name: user.name || user.email,
				total:
					(user._count.articles || 0) +
					(user._count.quests || 0) +
					(user._count.fanArts || 0),
				breakdown: user._count,
			}))
			.filter((c) => c.total > 0)
			.sort((a, b) => b.total - a.total)
			.slice(0, 6);

		// Ensure 7 days are always present
		const now = new Date();
		const viewsByDay: {
			date: string;
			displayDate: string;
			count: number;
		}[] = [];

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setHours(0, 0, 0, 0);
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const viewsByDayRaw: any[] = await prisma.$queryRaw`
            SELECT DATE("createdAt") as date, CAST(COUNT(*) AS INTEGER) as count
            FROM "AccessLog"
            WHERE "createdAt" >= ${sevenDaysAgo}
            GROUP BY DATE("createdAt")
            ORDER BY DATE("createdAt") ASC
        `;

		for (let i = 6; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);

			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");
			const dateKey = `${year}-${month}-${day}`;

			const displayDate = d.toLocaleDateString("pt-BR", {
				weekday: "short",
				day: "numeric",
			});

			const existing = viewsByDayRaw.find((item: any) => {
				// Robust comparison: convert any input date to YYYY-MM-DD
				const itemDate = new Date(item.date);
				const iY = itemDate.getFullYear();
				const iM = String(itemDate.getMonth() + 1).padStart(2, "0");
				const iD = String(itemDate.getDate()).padStart(2, "0");
				return `${iY}-${iM}-${iD}` === dateKey;
			});

			viewsByDay.push({
				date: dateKey,
				displayDate: displayDate,
				count: existing ? Number(existing.count) : 0,
			});
		}

		res.json({
			totalViews,
			totalUsers,
			viewsByPath: cleanedViewsByPath,
			viewsByDay: viewsByDay,
			topContributors: contributorMetrics,
		});
	} catch (error: any) {
		console.error("Fetch metrics error:", error);
		res.status(500).json({
			error: "Failed to fetch metrics",
			details: error.message,
		});
	}
};
