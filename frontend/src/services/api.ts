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

// Adapter to convert custom backend "Article" to frontend "Post"
const normalizeArticle = (item: {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	coverUrl?: string;
	category?: { name: string };
	createdAt: string;
	user?: { name: string; avatar?: string };
}): Post => {
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

const normalizeProject = (item: Project): Project => {
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

// Stub functions
export const createPost = async (): Promise<Post | null> => null;
export const uploadMedia = async (): Promise<number | null> => null;
