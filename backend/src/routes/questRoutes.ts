import express from "express";
import {
	getQuests,
	getQuestBySlug,
	createQuest,
	updateQuest,
	deleteQuest,
} from "../controllers/questController.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getQuests);
router.get("/:slug", getQuestBySlug);

// Protected routes (Admin only)
router.post("/", authenticateToken, authorizeRole(["ADMIN"]), createQuest);
router.put("/:id", authenticateToken, authorizeRole(["ADMIN"]), updateQuest);
router.delete("/:id", authenticateToken, authorizeRole(["ADMIN"]), deleteQuest);

export default router;
