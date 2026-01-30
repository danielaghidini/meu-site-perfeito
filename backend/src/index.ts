import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { authenticateToken } from "./middleware/auth.js";
import { authorizeRole } from "./middleware/auth.js";
import { prisma, connectDB } from "./db.js";

// Controllers
import {
	login,
	register,
	getMe,
	updateProfile,
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
} from "./controllers/authController.js";
import {
	getAllProjects,
	getProjectBySlug,
	createProject,
	updateProject,
	deleteProject,
} from "./controllers/projectController.js";
import {
	createContact,
	getAllContacts,
	updateContactStatus,
	deleteContact,
} from "./controllers/contactController.js";

console.log("Starting server...");
connectDB();

const app = express();
const port = process.env.PORT || 3001;

// CORS - Explicitly allowing everything for production debugging
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

app.get("/api/health", (req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- AUTH ---
// app.post("/auth/register", register); // Desativado por segurança. Use o painel de usuários.
app.post("/auth/login", login);
app.get("/auth/me", authenticateToken, getMe);
app.put("/auth/profile", authenticateToken, updateProfile);

// --- USER MANAGEMENT (ADMIN ONLY) ---
app.get("/api/users", authenticateToken, authorizeRole(["ADMIN"]), getAllUsers);
app.post("/api/users", authenticateToken, authorizeRole(["ADMIN"]), createUser);
app.put(
	"/api/users/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	updateUser,
);
app.delete(
	"/api/users/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	deleteUser,
);

// --- BLOG (ARTICLES) ---
app.get("/api/articles", async (req, res) => {
	try {
		const { slug } = req.query;
		if (slug) {
			const article = await prisma.article.findUnique({
				where: { slug: String(slug) },
				include: {
					category: true,
					user: { select: { name: true, avatar: true } },
				},
			});
			return res.json({ data: [article] }); // Formato array p/ compatibilidade
		}

		const articles = await prisma.article.findMany({
			include: {
				category: true,
				user: { select: { name: true, avatar: true } },
			},
			orderBy: { createdAt: "desc" },
		});
		res.json(articles);
	} catch (error) {
		console.error("Fetch articles error:", error);
		res.status(500).json({ error: "Failed to fetch articles" });
	}
});

// Get Single Article by Slug (Rota direta)
app.get("/api/articles/:slug", async (req, res) => {
	try {
		const { slug } = req.params;
		const article = await prisma.article.findUnique({
			where: { slug },
			include: {
				category: true,
				user: { select: { name: true, avatar: true } },
			},
		});
		if (!article) return res.status(404).json({ error: "Post not found" });
		res.json({ data: article });
	} catch (error) {
		res.status(500).json({ error: "Error fetching article" });
	}
});

app.post(
	"/api/articles",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	async (req, res) => {
		const {
			title,
			slug,
			content,
			excerpt,
			categoryId,
			coverUrl,
			isFeatured,
		} = req.body;
		try {
			const article = await prisma.article.create({
				data: {
					title,
					slug,
					content,
					excerpt,
					categoryId,
					coverUrl,
					isFeatured,
					authorId: req.user.id,
				},
			});
			res.status(201).json(article);
		} catch (error) {
			console.error("Create article error:", error);
			res.status(500).json({ error: "Failed to create article" });
		}
	},
);

// --- PROJECTS ---
app.get("/api/projects", getAllProjects);
app.get("/api/projects/:slug", getProjectBySlug);
app.post(
	"/api/projects",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	createProject,
);
app.put(
	"/api/projects/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	updateProject,
);
app.delete(
	"/api/projects/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	deleteProject,
);

// --- CONTACTS ---
app.post("/api/contacts", createContact);
app.get(
	"/api/contacts",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	getAllContacts,
);
app.put(
	"/api/contacts/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	updateContactStatus,
);
app.delete(
	"/api/contacts/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	deleteContact,
);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
