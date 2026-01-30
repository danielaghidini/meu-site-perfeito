import { Router } from "express";
import {
	getPosts,
	getPostById,
	createPost,
	addComment,
	likePost,
	deletePost,
} from "../controllers/forumController.js";
import {
	authenticateToken,
	optionalAuthenticateToken,
} from "../middleware/auth.js";

const router = Router();

// Public routes (with optional auth for like status)
router.get("/", optionalAuthenticateToken, getPosts);
router.get("/:id", optionalAuthenticateToken, getPostById);
router.post("/:id/like", authenticateToken, likePost);

// Protected routes
router.post("/", authenticateToken, createPost);
router.post("/:id/comments", authenticateToken, addComment);
router.delete("/:id", authenticateToken, deletePost);

export default router;
