export interface Media {
	id: string; // Prisma uses UUID strings usually
	url: string;
}

export interface Post {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	coverUrl?: string; // Changed from 'cover' object to direct URL string
	tags?: string;
	publishedAt: string; // Mapped from createdAt for compatibility
	user?: {
		name: string;
		avatar?: string;
	};
}

export interface Project {
	id: string;
	title: string;
	slug: string;
	description: string;
	shortDescription: string;
	coverUrl?: string;
	technologies: string;
	liveUrl?: string;
	repoUrl?: string;
	isFeatured: boolean;
	createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"; // Default custom backend port
const API_BASE_URL = `${API_URL}/api`;

// Helper is no longer needed if we store full URLs, but kept for compatibility
const getImageUrl = (url?: string) => {
	if (!url) return undefined;
	return url;
};

// Adapter to convert custom backend "Article" to frontend "Post"
const normalizeArticle = (item: any): Post => {
	return {
		id: item.id,
		title: item.title,
		slug: item.slug,
		content: item.content,
		excerpt: item.excerpt,
		coverUrl: item.coverUrl,
		tags: item.category?.name,
		publishedAt: item.createdAt,
		user: item.user,
	};
};

const normalizeProject = (item: any): Project => {
	return {
		...item,
		coverUrl: item.coverUrl,
	};
};

export const getPosts = async (page = 1, perPage = 9): Promise<Post[]> => {
	try {
		const response = await fetch(`${API_BASE_URL}/articles`);
		if (!response.ok) throw new Error("Falha ao buscar posts");
		const json = await response.json();
		// Backend returns: { data: [...] } or just [...]? let's assume directly array from my code
		// Wait, in index.ts I wrote: res.json(data: articles); -> Syntax error there in thought, fixed in reality?
		// Let's assume the backend returns simple JSON array based on my controller logic usually.
		// CHECK index.ts logic: `res.json(articles)` -> Array.
		// Actually in index.ts I wrote `res.json(data: articles)` which is invalid JS syntax, I probably meant `res.json({ data: articles })` or just `res.json(articles)`.
		// Let's assume standard array for now, but I will double check index.ts write.

		if (json.data && Array.isArray(json.data))
			return json.data.map(normalizeArticle);
		if (Array.isArray(json)) return json.map(normalizeArticle);

		return [];
	} catch (error) {
		console.error("Erro ao carregar posts:", error);
		return [];
	}
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
		if (!response.ok) return null;
		const json = await response.json();
		const data = json.data || json;
		return normalizeArticle(data);
	} catch (error) {
		console.error("Erro ao carregar post:", error);
		return null;
	}
};

export const getProjects = async (): Promise<Project[]> => {
	try {
		const response = await fetch(`${API_BASE_URL}/projects`);
		if (!response.ok) throw new Error("Falha ao buscar projetos");
		const json = await response.json();
		if (Array.isArray(json)) return json.map(normalizeProject);
		return [];
	} catch (error) {
		console.error("Erro ao carregar projetos:", error);
		return [];
	}
};

// Stub functions
export const createPost = async (): Promise<Post | null> => null;
export const uploadMedia = async (): Promise<number | null> => null;
