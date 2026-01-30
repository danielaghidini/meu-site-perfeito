export interface Media {
	id: number;
	url: string;
	alternativeText?: string;
}

export interface Post {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	content: string; // Rich Text (Markdown or HTMl)
	excerpt: string;
	cover?: Media;
	tags?: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface Project {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	description: string;
	shortDescription: string;
	cover?: Media;
	gallery?: Media[];
	technologies: string;
	liveUrl?: string;
	repoUrl?: string;
	isFeatured: boolean;
	createdAt: string;
}

const API_BASE_URL = "http://localhost:1337/api";

// Helper to extract clean URL for images
const getImageUrl = (url?: string) => {
	if (!url) return null;
	if (url.startsWith("http")) return url;
	return `http://localhost:1337${url}`;
};

// Helper to normalize Strapi v5 response
const normalizeValidData = (item: any) => {
	const attributes = item; // in v5 REST, attributes are often at the top level of the item or inside 'attributes' depending on exact call

	// Strapi v4/v5 consistency check:
	// Sometimes it's { id, attributes: { ... } }
	// Sometimes it's { id, ...attributes }

	const data = item.attributes || item;

	return {
		id: item.id,
		documentId: item.documentId,
		...data,
		cover: data.cover
			? {
					...data.cover,
					url: getImageUrl(data.cover.url),
				}
			: undefined,
		gallery: data.gallery
			? data.gallery.map((img: any) => ({
					...img,
					url: getImageUrl(img.url),
				}))
			: [],
	};
};

export const getPosts = async (page = 1, perPage = 9): Promise<Post[]> => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/posts?populate=*&sort=publishedAt:desc`,
		);
		if (!response.ok) throw new Error("Falha ao buscar posts");
		const json = await response.json();
		return json.data.map(normalizeValidData);
	} catch (error) {
		console.error("Erro ao carregar posts:", error);
		return [];
	}
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/posts?filters[slug][$eq]=${slug}&populate=*`,
		);
		if (!response.ok) return null;
		const json = await response.json();
		const data = json.data;
		if (data && data.length > 0) {
			return normalizeValidData(data[0]);
		}
		return null;
	} catch (error) {
		console.error("Erro ao carregar post:", error);
		return null;
	}
};

export const getProjects = async (): Promise<Project[]> => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/projects?populate=*&sort=isFeatured:desc`,
		);
		if (!response.ok) throw new Error("Falha ao buscar projetos");
		const json = await response.json();
		return json.data.map(normalizeValidData);
	} catch (error) {
		console.error("Erro ao carregar projetos:", error);
		return [];
	}
};

export const createPost = async (): Promise<Post | null> => {
	console.log("Static mode: createPost is disabled");
	return null;
};

export const uploadMedia = async (): Promise<number | null> => {
	console.log("Static mode: uploadMedia is disabled");
	return null;
};
