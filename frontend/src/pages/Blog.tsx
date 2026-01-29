import { useEffect, useState } from 'react';
import { getPosts, WordPressPost } from '@/services/api';
import PostCard from '@/components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';

const Blog = () => {
	const [posts, setPosts] = useState<WordPressPost[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadPosts = async () => {
			try {
				const data = await getPosts();
				setPosts(data);
			} catch (error) {
				console.error('Failed to load posts', error);
			} finally {
				setLoading(false);
			}
		};

		loadPosts();
	}, []);

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>

			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div key={i} className="flex flex-col space-y-3">
							<Skeleton className="h-[200px] w-full rounded-xl" />
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{posts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			)}
		</div>
	);
};

export default Blog;
