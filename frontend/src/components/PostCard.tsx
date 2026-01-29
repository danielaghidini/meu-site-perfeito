import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WordPressPost } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostCardProps {
	post: WordPressPost;
}

const PostCard = ({ post }: PostCardProps) => {
	const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
	const authorName = post._embedded?.author?.[0]?.name;

	// Format date safely
	const formattedDate = post.date ? format(new Date(post.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : '';

	return (
		<Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
			{featuredImage && (
				<div className="aspect-[3/2] w-full overflow-hidden">
					<img
						src={featuredImage}
						alt={post.title.rendered}
						className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
					/>
				</div>
			)}
			<CardHeader>
				<div className="text-sm text-muted-foreground mb-2 flex justify-between">
					<span>{formattedDate}</span>
					{authorName && <span>{authorName}</span>}
				</div>
				<CardTitle className="text-xl line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
			</CardHeader>
			<CardContent className="flex-grow">
				<div className="text-muted-foreground line-clamp-3">
					{parse(post.excerpt.rendered)}
				</div>
			</CardContent>
			<CardFooter>
				<Button asChild className="w-full">
					<Link to={`/blog/${post.slug}`}>Ler Mais</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default PostCard;
