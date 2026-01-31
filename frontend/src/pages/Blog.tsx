import { useEffect, useState, useMemo } from "react";
import { getPosts, getCategories, Post, Category } from "@/services/api";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const Blog = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null,
	);

	useEffect(() => {
		const loadData = async () => {
			try {
				const [postsData, categoriesData] = await Promise.all([
					getPosts(true),
					getCategories(),
				]);
				setPosts(postsData);
				setCategories(categoriesData);
			} catch (error) {
				console.error("Failed to load blog data", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const filteredPosts = useMemo(() => {
		if (!selectedCategory) return posts;
		return posts.filter((post) => post.tags === selectedCategory);
	}, [posts, selectedCategory]);

	return (
		<div className="min-h-screen flex flex-col pt-10">
			<SEO
				title="Blog & Novidades"
				description="Explorando ideias, tecnologias e compartilhando conhecimento sobre desenvolvimento web e design."
				canonical="/blog"
			/>
			<header className="py-6 container mx-auto px-4">
				<Button
					variant="ghost"
					asChild
					className="pl-0 hover:pl-2 transition-all hover:bg-transparent"
				>
					<Link
						to="/"
						className="flex items-center gap-2 text-muted-foreground hover:text-primary"
					>
						<ArrowLeft className="w-5 h-5" /> Voltar para o início
					</Link>
				</Button>
			</header>
			<main className="flex-grow pb-12">
				<div className="container mx-auto px-4">
					<div className="text-center mb-10">
						<span className="text-primary font-medium text-sm tracking-wider uppercase">
							Nosso Conteúdo
						</span>
						<h1 className="font-display text-4xl md:text-5xl font-bold mt-4">
							Blog &{" "}
							<span className="text-gradient">Novidades</span>
						</h1>
					</div>

					<div className="flex flex-wrap justify-center gap-2 mb-12">
						<Button
							variant={
								selectedCategory === null
									? "default"
									: "outline"
							}
							size="sm"
							onClick={() => setSelectedCategory(null)}
							className="rounded-full px-6"
						>
							Tudo
						</Button>
						{categories.map((category) => (
							<Button
								key={category.id}
								variant={
									selectedCategory === category.name
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() =>
									setSelectedCategory(category.name)
								}
								className="rounded-full px-6"
							>
								{category.name}
							</Button>
						))}
					</div>

					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div
									key={i}
									className="flex flex-col space-y-3"
								>
									<Skeleton className="h-[200px] w-full rounded-xl" />
									<Skeleton className="h-4 w-[250px]" />
									<Skeleton className="h-4 w-[200px]" />
								</div>
							))}
						</div>
					) : filteredPosts.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredPosts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
					) : (
						<div className="text-center py-20">
							<p className="text-xl text-muted-foreground">
								Nenhum post encontrado nesta categoria.
							</p>
							<Button
								variant="link"
								onClick={() => setSelectedCategory(null)}
								className="mt-4"
							>
								Ver todos os posts
							</Button>
						</div>
					)}
				</div>
			</main>
			<Footer simple />
		</div>
	);
};

export default Blog;
