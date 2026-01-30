import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PostCardProps {
	post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
	const featuredImage = post.coverUrl;

	// Format date safely
	const formattedDate = post.publishedAt
		? format(new Date(post.publishedAt), "d 'de' MMMM 'de' yyyy", {
				locale: ptBR,
			})
		: "";

	return (
		<Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
			{featuredImage && (
				<div className="aspect-[3/2] w-full overflow-hidden bg-muted">
					<img
						src={featuredImage}
						alt={post.title}
						className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
					/>
				</div>
			)}
			<CardHeader>
				<div className="text-sm text-muted-foreground mb-2 flex justify-between">
					<span>{formattedDate}</span>
				</div>
				<CardTitle className="text-xl line-clamp-2">
					{post.title}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow">
				<p className="text-muted-foreground line-clamp-3">
					{post.excerpt}
				</p>
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
