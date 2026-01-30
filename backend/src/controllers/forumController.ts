import { Response } from "express";
import { prisma } from "../db.js";
import { AuthRequest } from "../middleware/auth.js";

// Helper to generate slugs
const generateSlug = (title: string) => {
	return (
		title
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, "")
			.replace(/[\s_-]+/g, "-")
			.replace(/^-+|-+$/g, "") +
		"-" +
		Date.now().toString().slice(-4)
	);
};

// Helper to get user ID if authenticated
const getUserId = (req: AuthRequest) => {
	return req.user?.id || req.user?.userId || null;
};

export const getPosts = async (req: AuthRequest, res: Response) => {
	try {
		const userId = getUserId(req);

		const posts = await prisma.forumPost.findMany({
			include: {
				author: {
					select: { name: true, id: true },
				},
				comments: {
					include: {
						author: { select: { name: true } },
					},
				},
				likedBy: userId ? { where: { userId: userId } } : false,
			},
			orderBy: { createdAt: "desc" },
		});

		const formattedPosts = posts.map((p) => ({
			id: p.id,
			title: p.title,
			slug: p.slug,
			content: p.content,
			// @ts-ignore - Generic author type safety
			author: p.author?.name || "Unknown",
			category: p.category,
			likes: p.likes,
			// @ts-ignore - Handle conditional include
			isLiked: p.likedBy ? p.likedBy.length > 0 : false,
			date: p.createdAt.toISOString().split("T")[0],
			comments: p.comments.map((c) => ({
				id: c.id,
				// @ts-ignore - Generic author type safety
				author: c.author?.name || "Unknown",
				text: c.content,
				date: c.createdAt.toISOString().split("T")[0],
			})),
			isAuthor: userId === p.authorId,
		}));

		res.json(formattedPosts);
	} catch (error) {
		console.error("Error fetching posts:", error);
		res.status(500).json({ error: "Failed to fetch posts" });
	}
};

export const getPostById = async (req: AuthRequest, res: Response) => {
	const { id } = req.params;
	const userId = getUserId(req);

	if (!id || typeof id !== "string") {
		return res.status(400).json({ error: "Invalid ID/Slug" });
	}

	try {
		const includeConfig = {
			author: { select: { name: true, id: true } },
			comments: {
				include: { author: { select: { name: true } } },
				orderBy: { createdAt: "asc" },
			},
			likedBy: userId ? { where: { userId: userId } } : false,
		} as const; // constant assertion helps with inference

		// Try finding by slug first, then ID
		let post = await prisma.forumPost.findUnique({
			where: { slug: id },
			// @ts-ignore - Argument type mismatch in some prisma versions with conditional includes
			include: includeConfig,
		});

		if (!post) {
			post = await prisma.forumPost.findUnique({
				where: { id },
				// @ts-ignore
				include: includeConfig,
			});
		}

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const formattedPost = {
			id: post.id,
			title: post.title,
			slug: post.slug,
			content: post.content,
			// @ts-ignore
			author: post.author?.name || "Unknown",
			category: post.category,
			likes: post.likes,
			// @ts-ignore
			isLiked: post.likedBy ? post.likedBy.length > 0 : false,
			date: post.createdAt.toISOString().split("T")[0],
			comments: post.comments.map((c) => ({
				id: c.id,
				// @ts-ignore
				author: c.author?.name || "Unknown",
				text: c.content,
				date: c.createdAt.toISOString().split("T")[0],
			})),
			isAuthor: userId === post.authorId,
		};

		res.json(formattedPost);
	} catch (error) {
		console.error("Error fetching post:", error);
		res.status(500).json({ error: "Failed to fetch post" });
	}
};

export const createPost = async (req: AuthRequest, res: Response) => {
	const { title, content, category } = req.body;
	const user = req.user;

	if (!user || (!user.id && !user.userId)) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const userId = user.id || user.userId;

	try {
		// Check if user is trying to post an Announcement (admin only)
		if (category === "Announcements") {
			const dbUser = await prisma.user.findUnique({
				where: { id: userId },
			});
			if (dbUser?.role !== "ADMIN") {
				return res
					.status(403)
					.json({ error: "Only admins can post Announcements" });
			}
		}

		const slug = generateSlug(title);

		const post = await prisma.forumPost.create({
			data: {
				title,
				slug,
				content,
				category: category || "General",
				authorId: userId,
			},
			include: {
				author: { select: { name: true } },
			},
		});

		const formattedPost = {
			id: post.id,
			title: post.title,
			slug: post.slug,
			content: post.content,
			// @ts-ignore
			author: post.author?.name || "Unknown",
			category: post.category,
			likes: post.likes,
			isLiked: false,
			date: post.createdAt.toISOString().split("T")[0],
			comments: [],
		};

		res.status(201).json(formattedPost);
	} catch (error) {
		console.error("Error creating post:", error);
		res.status(500).json({ error: "Failed to create post" });
	}
};

export const addComment = async (req: AuthRequest, res: Response) => {
	const { id } = req.params; // Post ID or Slug
	const { content } = req.body;
	const user = req.user;

	if (!id || typeof id !== "string") {
		return res.status(400).json({ error: "Invalid ID" });
	}

	if (!user || (!user.id && !user.userId)) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const userId = user.id || user.userId;

	try {
		// Resolve slug to ID if necessary
		let post = await prisma.forumPost.findUnique({ where: { slug: id } });
		if (!post) {
			post = await prisma.forumPost.findUnique({ where: { id } });
		}
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = await prisma.forumComment.create({
			data: {
				content,
				postId: post.id,
				authorId: userId,
			},
			include: {
				author: { select: { name: true } },
			},
		});

		// Format
		const formattedComment = {
			id: comment.id,
			// @ts-ignore
			author: comment.author?.name || "Unknown",
			text: comment.content,
			date: comment.createdAt.toISOString().split("T")[0],
		};

		res.status(201).json(formattedComment);
	} catch (error) {
		console.error("Error adding comment:", error);
		res.status(500).json({ error: "Failed to add comment" });
	}
};

export const likePost = async (req: AuthRequest, res: Response) => {
	const { id } = req.params;
	const user = req.user;

	if (!id || typeof id !== "string") {
		return res.status(400).json({ error: "Invalid ID" });
	}

	if (!user || (!user.id && !user.userId)) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const userId = user.id || user.userId;

	try {
		// Resolve slug to ID
		let post = await prisma.forumPost.findUnique({ where: { slug: id } });
		if (!post) {
			post = await prisma.forumPost.findUnique({ where: { id } });
		}
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// Check if user already liked
		const existingLike = await prisma.postLike.findUnique({
			where: {
				userId_postId: {
					userId: userId,
					postId: post.id,
				},
			},
		});

		if (existingLike) {
			// Unlike
			await prisma.postLike.delete({
				where: {
					userId_postId: {
						userId: userId,
						postId: post.id,
					},
				},
			});
			const updatedPost = await prisma.forumPost.update({
				where: { id: post.id },
				data: { likes: { decrement: 1 } },
			});
			res.json({ likes: updatedPost.likes, isLiked: false });
		} else {
			// Like
			await prisma.postLike.create({
				data: {
					userId: userId,
					postId: post.id,
				},
			});
			const updatedPost = await prisma.forumPost.update({
				where: { id: post.id },
				data: { likes: { increment: 1 } },
			});
			res.json({ likes: updatedPost.likes, isLiked: true });
		}
	} catch (error) {
		console.error("Error liking post:", error);
		res.status(500).json({ error: "Failed to like post" });
	}
};

export const deletePost = async (req: AuthRequest, res: Response) => {
	const { id } = req.params;
	const user = req.user;

	if (!id) {
		return res.status(400).json({ error: "Invalid ID" });
	}

	if (!user || (!user.id && !user.userId)) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const userId = user.id || user.userId;

	try {
		// Find post to check ownership
		let post = await prisma.forumPost.findUnique({
			where: { slug: id as string },
		});
		if (!post) {
			post = await prisma.forumPost.findUnique({
				where: { id: id as string },
			});
		}

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const dbUser = await prisma.user.findUnique({ where: { id: userId } });

		if (dbUser?.role !== "ADMIN" && post.authorId !== userId) {
			return res.status(403).json({
				error: "Forbidden: You are not authorized to delete this post",
			});
		}

		await prisma.forumPost.delete({ where: { id: post.id } });
		res.json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error deleting post:", error);
		res.status(500).json({ error: "Failed to delete post" });
	}
};
