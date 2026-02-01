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
	categoryId?: string;
	published?: boolean;
	publishedAt: string; // Mapped from createdAt for compatibility
	user?: {
		name: string;
		avatar?: string;
	};
}

export interface Category {
	id: string;
	name: string;
	description?: string;
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

export interface User {
	id: string;
	email: string;
	name: string | null;
	avatar: string | null;
	role: string;
	createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"; // Default custom backend port
const API_BASE_URL = `${API_URL}/api`;

// Helper is no longer needed if we store full URLs, but kept for compatibility
const getImageUrl = (url?: string) => {
	if (!url) return undefined;
	return url;
};

interface BackendArticle {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	coverUrl?: string;
	categoryId?: string;
	published?: boolean;
	category?: { id: string; name: string };
	createdAt: string;
	user?: { name: string; avatar?: string };
}

// Adapter to convert custom backend "Article" to frontend "Post"
const normalizeArticle = (item: BackendArticle): Post => {
	return {
		id: item.id,
		title: item.title,
		slug: item.slug,
		content: item.content,
		excerpt: item.excerpt,
		coverUrl: item.coverUrl,
		tags: item.category?.name,
		categoryId: item.categoryId || item.category?.id,
		published: item.published,
		publishedAt: item.createdAt,
		user: item.user,
	};
};

const normalizeProject = (item: Project): Project => {
	return {
		...item,
		coverUrl: item.coverUrl,
	};
};

export const getPosts = async (published?: boolean): Promise<Post[]> => {
	try {
		const url =
			published !== undefined
				? `${API_BASE_URL}/articles?published=${published}`
				: `${API_BASE_URL}/articles`;
		const response = await fetch(url);
		if (!response.ok) throw new Error("Falha ao buscar posts");
		const json = await response.json();
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

// --- CATEGORIES ---
export const getCategories = async (): Promise<Category[]> => {
	try {
		const response = await fetch(`${API_BASE_URL}/categories`);
		if (!response.ok) throw new Error("Falha ao buscar categorias");
		return await response.json();
	} catch (error) {
		console.error("Erro ao carregar categorias:", error);
		return [];
	}
};

export const createCategory = async (
	data: Partial<Category>,
	token: string,
): Promise<Category | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/categories`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) throw new Error("Falha ao criar categoria");
		return await response.json();
	} catch (error) {
		console.error("Erro ao criar categoria:", error);
		return null;
	}
};

export const deleteCategory = async (
	id: string,
	token: string,
): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.ok;
	} catch (error) {
		console.error("Erro ao excluir categoria:", error);
		return false;
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

export const apiGetProjectBySlug = async (
	slug: string,
): Promise<Project | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/projects/${slug}`);
		if (!response.ok) return null;
		const json = await response.json();
		return json; // Assuming it already matches the Project interface
	} catch (error) {
		console.error("Erro ao carregar projeto:", error);
		return null;
	}
};

export const createProject = async (
	projectData: Partial<Project>,
	token: string,
): Promise<Project | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/projects`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(projectData),
		});
		if (!response.ok) throw new Error("Falha ao criar projeto");
		const json = await response.json();
		return normalizeProject(json);
	} catch (error) {
		console.error("Erro ao criar projeto:", error);
		return null;
	}
};

export const updateProject = async (
	id: string,
	projectData: Partial<Project>,
	token: string,
): Promise<Project | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(projectData),
		});
		if (!response.ok) throw new Error("Falha ao atualizar projeto");
		const json = await response.json();
		return normalizeProject(json);
	} catch (error) {
		console.error("Erro ao atualizar projeto:", error);
		return null;
	}
};

export const deleteProject = async (
	id: string,
	token: string,
): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.ok;
	} catch (error) {
		console.error("Erro ao deletar projeto:", error);
		return false;
	}
};

// --- CONTACTS ---
export interface Contact {
	id: string;
	name: string;
	email: string;
	phone?: string;
	company?: string;
	project: string;
	message: string;
	status: "NEW" | "READ" | "ARCHIVED";
	createdAt: string;
}

export const sendContact = async (
	data: Omit<Contact, "id" | "status" | "createdAt">,
): Promise<Contact> => {
	console.log("Sending contact data:", data);
	const response = await fetch(`${API_BASE_URL}/contacts`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		console.error("Server error sending contact:", errorData);
		throw new Error(errorData.error || "Failed to send message");
	}

	const result = await response.json();
	console.log("Contact sent successfully:", result);
	return result;
};

export const getContacts = async (token: string): Promise<Contact[]> => {
	const response = await fetch(`${API_BASE_URL}/contacts`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!response.ok) throw new Error("Failed to fetch messages");
	return response.json();
};

export const updateContactStatus = async (
	id: string,
	status: Contact["status"],
	token: string,
): Promise<Contact> => {
	const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ status }),
	});
	if (!response.ok) throw new Error("Failed to update message status");
	return response.json();
};

export const apiDeleteContact = async (
	id: string,
	token: string,
): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!response.ok) throw new Error("Failed to delete message");
};

// --- USERS ---
export const apiGetUsers = async (token: string): Promise<User[]> => {
	const response = await fetch(`${API_BASE_URL}/users`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!response.ok) throw new Error("Failed to fetch users");
	return response.json();
};

export const apiCreateUser = async (
	userData: Partial<User> & { password?: string },
	token: string,
): Promise<User> => {
	const response = await fetch(`${API_BASE_URL}/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(userData),
	});
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to create user");
	}
	return response.json();
};

export const apiUpdateUser = async (
	id: string,
	userData: Partial<User>,
	token: string,
): Promise<User> => {
	const response = await fetch(`${API_BASE_URL}/users/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(userData),
	});
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to update user");
	}
	return response.json();
};

export const apiDeleteUser = async (
	id: string,
	token: string,
): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/users/${id}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!response.ok) throw new Error("Failed to delete user");
};

export const createPost = async (
	postData: Partial<Post>,
	token: string,
): Promise<Post | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/articles`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(postData),
		});
		if (!response.ok) throw new Error("Falha ao criar post");
		const json = await response.json();
		return normalizeArticle(json);
	} catch (error) {
		console.error("Erro ao criar post:", error);
		return null;
	}
};

export const updatePost = async (
	id: string,
	postData: Partial<Post>,
	token: string,
): Promise<Post | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(postData),
		});
		if (!response.ok) throw new Error("Falha ao atualizar post");
		const json = await response.json();
		return normalizeArticle(json);
	} catch (error) {
		console.error("Erro ao atualizar post:", error);
		return null;
	}
};

export const deletePost = async (
	id: string,
	token: string,
): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.ok;
	} catch (error) {
		console.error("Erro ao deletar post:", error);
		return false;
	}
};

export const generateAIContent = async (
	title: string,
	prompt: string,
	token: string,
): Promise<string | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/ai/generate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ title, prompt }),
		});

		if (!response.ok) throw new Error("Falha na geração com IA");
		const data = await response.json();
		return data.content;
	} catch (error) {
		console.error("Erro na geração com IA:", error);
		return null;
	}
};

export const uploadImage = async (
	file: File,
	token: string,
): Promise<string | null> => {
	try {
		const formData = new FormData();
		formData.append("image", file);

		const response = await fetch(`${API_URL}/api/upload`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		});

		if (!response.ok) throw new Error("Falha no upload");
		const data = await response.json();
		return data.url;
	} catch (error) {
		console.error("Erro no upload:", error);
		return null;
	}
};
export const getMedia = async (token: string): Promise<Media[]> => {
	try {
		const response = await fetch(`${API_BASE_URL}/media`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error("Falha ao buscar mídia");
		return await response.json();
	} catch (error) {
		console.error("Erro ao carregar mídia:", error);
		return [];
	}
};

export interface DashboardStats {
	stats: {
		articles: number;
		projects: number;
		contacts: number;
		newContacts: number;
	};
	activities: Array<{
		id: string;
		type: "article" | "project" | "contact";
		title: string;
		date: string;
		status?: string;
	}>;
}

export const getDashboardStats = async (
	token: string,
): Promise<DashboardStats | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!response.ok)
			throw new Error("Falha ao buscar estatísticas do painel");
		return await response.json();
	} catch (error) {
		console.error("Erro ao carregar estatísticas:", error);
		return null;
	}
};

// --- SOCIAL MEDIA ---
export interface SocialSettings {
	instagramId: string | null;
	hasToken: boolean;
	appId: string;
}

export const getSocialSettings = async (
	token: string,
): Promise<SocialSettings | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/social/settings`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!response.ok) throw new Error("Falha ao buscar config social");
		return await response.json();
	} catch (error) {
		console.error("Erro ao carregar config social:", error);
		return null;
	}
};

export const saveInstagramToken = async (
	shortLivedToken: string,
	token: string,
): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}/social/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ shortLivedToken }),
		});
		return response.ok;
	} catch (error) {
		console.error("Erro ao salvar token instagram:", error);
		return false;
	}
};

export const generateInstagramCaption = async (
	idea: string,
	token: string,
): Promise<string | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/social/caption`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ idea }),
		});
		if (!response.ok) throw new Error("Falha ao gerar legenda");
		const data = await response.json();
		return data.caption;
	} catch (error) {
		console.error("Erro ao gerar legenda:", error);
		return null;
	}
};

export const publishToInstagram = async (
	imageUrl: string,
	caption: string,
	token: string,
): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}/social/publish`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ imageUrl, caption }),
		});
		return response.ok;
	} catch (error) {
		console.error("Erro ao publicar no instagram:", error);
		return false;
	}
};
