export interface WordPressPost {
	id: number;
	date: string;
	slug: string;
	title: {
		rendered: string;
	};
	content: {
		rendered: string;
	};
	excerpt: {
		rendered: string;
	};
	_embedded?: {
		"wp:featuredmedia"?: Array<{
			source_url: string;
			alt_text: string;
		}>;
		author?: Array<{
			name: string;
			avatar_urls: Record<string, string>;
		}>;
	};
}

// URL do seu novo backend local
const API_BASE_URL = "http://localhost:4005/api";

// Se você quiser usar os dados locais do frontend em vez do backend, altere para true
const USE_MOCKS = false;

const MOCK_POSTS: WordPressPost[] = [
	{
		id: 1,
		date: new Date().toISOString(),
		slug: "bem-vindo-ao-meu-site",
		title: { rendered: "Bem-vindo ao Meu Site Perfeito (Mock Data)" },
		content: {
			rendered:
				"<p>Este post está sendo exibido via Mock Data no Frontend.</p>",
		},
		excerpt: {
			rendered:
				"O backend ainda não está conectado ou você escolheu usar Mocks.",
		},
	},
];

export const getPosts = async (
	page = 1,
	perPage = 9,
): Promise<WordPressPost[]> => {
	if (USE_MOCKS) return MOCK_POSTS;

	try {
		const response = await fetch(`${API_BASE_URL}/posts`);
		if (!response.ok) throw new Error("Falha ao buscar posts");
		return await response.json();
	} catch (error) {
		console.error("Erro no backend, usando Mocks:", error);
		return MOCK_POSTS;
	}
};

export const getPostBySlug = async (
	slug: string,
): Promise<WordPressPost | null> => {
	if (USE_MOCKS) return MOCK_POSTS.find((post) => post.slug === slug) || null;

	try {
		const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
		if (!response.ok) return null;
		return await response.json();
	} catch (error) {
		return MOCK_POSTS.find((post) => post.slug === slug) || null;
	}
};

export const getProjects = async (): Promise<WordPressPost[]> => {
	return getPosts();
};

export const createPost = async (): Promise<WordPressPost | null> => {
	console.log("Static mode: createPost is disabled");
	return null;
};

export const uploadMedia = async (): Promise<number | null> => {
	console.log("Static mode: uploadMedia is disabled");
	return null;
};
