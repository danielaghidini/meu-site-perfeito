export const BLOG_CATEGORIES = [
	"Tecnologia",
	"Design",
	"Tutorial",
	"Novidades",
	"Dicas",
	"Web Design",
	"Especiais",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
