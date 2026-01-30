import { useEffect, useState } from "react";
import { getPosts, Post } from "@/services/api";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const Blog = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadPosts = async () => {
			try {
				const data = await getPosts();
				setPosts(data);
			} catch (error) {
				console.error("Failed to load posts", error);
			} finally {
				setLoading(false);
			}
		};

		loadPosts();
	}, []);

	return (
		<div className="min-h-screen flex flex-col">
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
					<div className="text-center mb-16">
						<span className="text-primary font-medium text-sm tracking-wider uppercase">
							Nosso Conteúdo
						</span>
						<h1 className="font-display text-4xl md:text-5xl font-bold mt-4">
							Blog &{" "}
							<span className="text-gradient">Novidades</span>
						</h1>
					</div>
					<p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
						Explorando ideias, tecnologias e compartilhando
						conhecimento sobre desenvolvimento web e design.
					</p>

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
					) : posts.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{posts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
					) : (
						<div className="text-center py-20">
							<p className="text-xl text-muted-foreground">
								Em breve novos posts por aqui!
							</p>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Blog;
