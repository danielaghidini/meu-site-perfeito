import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, WordPressPost } from '@/services/api';
import parse from 'html-react-parser';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProjectDetails = () => {
	const { slug } = useParams<{ slug: string }>();
	const [project, setProject] = useState<WordPressPost | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadProject = async () => {
			if (!slug) return;
			try {
				// ideally fetching from /projects endpoint or simple posts for now
				const data = await getPostBySlug(slug);
				setProject(data);
			} catch (error) {
				console.error('Failed to load project', error);
			} finally {
				setLoading(false);
			}
		};

		loadProject();
	}, [slug]);

	if (loading) {
		return <div className="container py-20"><Skeleton className="h-[400px] w-full" /></div>;
	}

	if (!project) {
		return <div className="container py-20 text-center">Project not found</div>;
	}

	const featuredImage = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Header */}
			<div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
				{featuredImage && (
					<img
						src={featuredImage}
						alt={project.title.rendered}
						className="absolute inset-0 w-full h-full object-cover opacity-50"
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
				<div className="absolute bottom-0 left-0 w-full p-8 container">
					<Button variant="outline" size="sm" asChild className="mb-6 backdrop-blur-md bg-transparent border-white/20 text-white hover:bg-white/10">
						<Link to="/" className="flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" /> Back to Projects
						</Link>
					</Button>
					<h1 className="text-4xl md:text-6xl font-bold text-white mb-4" dangerouslySetInnerHTML={{ __html: project.title.rendered }} />
					<div className="flex gap-2">
						<Badge variant="secondary" className="backdrop-blur-md bg-white/10">React</Badge>
						<Badge variant="secondary" className="backdrop-blur-md bg-white/10">WordPress</Badge>
					</div>
				</div>
			</div>

			<div className="container py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
				<div className="lg:col-span-2 prose prose-lg dark:prose-invert max-w-none">
					{parse(project.content.rendered)}
				</div>
				<div className="space-y-6">
					<div className="p-6 rounded-xl border bg-card">
						<h3 className="font-bold text-xl mb-4">Project Info</h3>
						<div className="space-y-4">
							<Button className="w-full gap-2">
								<ExternalLink className="h-4 w-4" /> Live Demo
							</Button>
							<Button variant="outline" className="w-full gap-2">
								<Github className="h-4 w-4" /> View Code
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectDetails;
