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
import {
	getAllArticles,
	getArticleBySlug,
	createArticle,
	updateArticle,
	deleteArticle,
} from "./controllers/articleController.js";
import {
	getAllCategories,
	createCategory,
	deleteCategory,
} from "./controllers/categoryController.js";
import { generateArticleContent } from "./controllers/aiController.js";
import { getAllImages } from "./controllers/mediaController.js";
import { getStats } from "./controllers/dashboardController.js";
import {
	getSocialSettings,
	saveInstagramToken,
	generateCaption,
	publishToInstagram,
} from "./controllers/socialController.js";
import { upload } from "./middleware/upload.js";

console.log("Starting server...");
console.log(
	"NVIDIA_API_KEY loaded:",
	process.env.NVIDIA_API_KEY ? "Yes" : "No",
);
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

app.post(
	"/api/upload",
	authenticateToken,
	upload.single("image"),
	(req, res) => {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}
		res.json({ url: (req.file as any).path });
	},
);

app.get("/api/media", authenticateToken, getAllImages);

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

// --- DASHBOARD ---
app.get(
	"/api/dashboard/stats",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	getStats,
);

// --- BLOG (ARTICLES) ---
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:slug", getArticleBySlug);
app.post(
	"/api/articles",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	createArticle,
);
app.put(
	"/api/articles/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	updateArticle,
);
app.delete(
	"/api/articles/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	deleteArticle,
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
// --- CATEGORIES ---
app.get("/api/categories", getAllCategories);
app.post(
	"/api/categories",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	createCategory,
);
app.delete(
	"/api/categories/:id",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	deleteCategory,
);

// --- AI ASSISTANT ---
app.post(
	"/api/ai/generate",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	generateArticleContent,
);

// --- SOCIAL MEDIA ---
app.get(
	"/api/social/settings",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	getSocialSettings,
);
app.post(
	"/api/social/token",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	saveInstagramToken,
);
app.post(
	"/api/social/caption",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	generateCaption,
);
app.post(
	"/api/social/publish",
	authenticateToken,
	authorizeRole(["ADMIN"]),
	publishToInstagram,
);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
