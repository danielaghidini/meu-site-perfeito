import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostBySlug, Post } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import SEO from "@/components/SEO";

const SinglePost = () => {
	const { slug } = useParams<{ slug: string }>();
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadPost = async () => {
			if (!slug) return;
			try {
				const data = await getPostBySlug(slug);
				setPost(data);
			} catch (error) {
				console.error("Failed to load post", error);
			} finally {
				setLoading(false);
			}
		};

		loadPost();
	}, [slug]);

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col">
				<main className="flex-grow pt-24 pb-12">
					<div className="container mx-auto px-4 max-w-3xl">
						<Skeleton className="h-8 w-32 mb-6" />
						<Skeleton className="h-12 w-3/4 mb-4" />
						<Skeleton className="h-[400px] w-full rounded-xl mb-8" />
						<div className="space-y-4">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-5/6" />
						</div>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (!post) {
		return (
			<div className="min-h-screen flex flex-col">
				<main className="flex-grow pt-24 pb-12 flex items-center justify-center">
					<div className="text-center">
						<h1 className="text-3xl font-bold mb-4">
							Post não encontrado
						</h1>
						<Button asChild>
							<Link to="/blog">Voltar para o Blog</Link>
						</Button>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	const formattedDate = post.publishedAt
		? format(new Date(post.publishedAt), "d 'de' MMMM 'de' yyyy", {
				locale: ptBR,
			})
		: "";

	return (
		<div className="min-h-screen flex flex-col">
			<SEO
				title={post.title}
				description={post.excerpt}
				ogImage={post.coverUrl || "/og-image.png"}
				canonical={`/blog/${post.slug}`}
				ogType="article"
				authorName={post.user?.name || "Daniel Aghidini"}
				publishedDate={post.publishedAt}
				articleSection={post.tags}
			/>
			<main className="flex-grow pt-24 pb-12">
				<div className="container mx-auto px-4 max-w-4xl">
					<Button
						variant="ghost"
						asChild
						className="mb-6 pl-0 hover:pl-2 transition-all"
					>
						<Link to="/blog" className="flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" /> Voltar para o Blog
						</Link>
					</Button>

					<header className="mb-8">
						<div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
							<span>{formattedDate}</span>
							{post.tags && (
								<>
									<span>•</span>
									<span className="bg-secondary px-2 py-1 rounded text-xs text-secondary-foreground font-medium">
										{post.tags}
									</span>
								</>
							)}
						</div>
						<h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 gradient-text">
							{post.title}
						</h1>
					</header>

					{post.coverUrl && (
						<div className="rounded-xl overflow-hidden mb-10 shadow-lg aspect-video bg-muted">
							<img
								src={post.coverUrl}
								alt={post.title}
								className="w-full h-full object-cover"
							/>
						</div>
					)}

					<article
						className="prose dark:prose-invert max-w-none 
						prose-headings:font-bold prose-headings:text-foreground
						prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
						prose-strong:text-foreground prose-strong:font-bold
						prose-li:text-muted-foreground
						prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
						prose-a:text-primary hover:prose-a:underline
						prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1 prose-code:rounded prose-code:font-mono
						prose-img:rounded-xl prose-img:shadow-lg"
					>
						<ReactMarkdown rehypePlugins={[rehypeRaw]}>
							{post.content}
						</ReactMarkdown>
					</article>
				</div>
			</main>
			<Footer simple />
		</div>
	);
};

export default SinglePost;
