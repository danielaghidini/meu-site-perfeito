import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, WordPressPost } from '@/services/api';
import parse from 'html-react-parser';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';

const SinglePost = () => {
	const { slug } = useParams<{ slug: string }>();
	const [post, setPost] = useState<WordPressPost | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadPost = async () => {
			if (!slug) return;
			try {
				const data = await getPostBySlug(slug);
				setPost(data);
			} catch (error) {
				console.error('Failed to load post', error);
			} finally {
				setLoading(false);
			}
		};

		loadPost();
	}, [slug]);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-12 max-w-3xl">
				<Skeleton className="h-8 w-32 mb-6" />
				<Skeleton className="h-12 w-3/4 mb-4" />
				<Skeleton className="h-[400px] w-full rounded-xl mb-8" />
				<div className="space-y-4">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
				</div>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="container mx-auto px-4 py-12 text-center">
				<h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
				<Button asChild>
					<Link to="/blog">Voltar para o Blog</Link>
				</Button>
			</div>
		);
	}

	const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
	const authorName = post._embedded?.author?.[0]?.name;
	const formattedDate = post.date ? format(new Date(post.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : '';

	return (
		<div className="container mx-auto px-4 py-12 max-w-4xl">
			<Button variant="ghost" asChild className="mb-6 pl-0 hover:pl-2 transition-all">
				<Link to="/blog" className="flex items-center gap-2">
					<ArrowLeft className="h-4 w-4" /> Voltar para o Blog
				</Link>
			</Button>

			<header className="mb-8">
				<div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
					<span>{formattedDate}</span>
					{authorName && (
						<>
							<span>•</span>
							<span>{authorName}</span>
						</>
					)}
				</div>
				<h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
			</header>

			{featuredImage && (
				<div className="rounded-xl overflow-hidden mb-10 shadow-lg">
					<img
						src={featuredImage}
						alt={post.title.rendered}
						className="w-full h-auto object-cover"
					/>
				</div>
			)}

			<article className="prose dark:prose-invert max-w-none 
				prose-headings:font-bold prose-headings:text-primary 
				prose-p:text-foreground prose-p:leading-relaxed
				prose-strong:text-foreground prose-strong:font-bold
				prose-li:text-foreground 
				prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
				prose-a:text-primary hover:prose-a:underline
				prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded
				prose-img:rounded-xl prose-img:shadow-lg">
				{parse(post.content.rendered)}
			</article>
		</div>
	);
};

export default SinglePost;
