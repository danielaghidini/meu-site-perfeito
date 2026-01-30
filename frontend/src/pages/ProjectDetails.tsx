import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGetProjectBySlug, Project } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProjectDetails = () => {
	const { slug } = useParams<{ slug: string }>();
	const [project, setProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadProject = async () => {
			if (!slug) return;
			try {
				const data = await apiGetProjectBySlug(slug);
				setProject(data);
			} catch (error) {
				console.error("Failed to load project", error);
			} finally {
				setLoading(false);
			}
		};

		loadProject();
	}, [slug]);

	if (loading) {
		return (
			<div className="container py-20">
				<Skeleton className="h-[400px] w-full" />
			</div>
		);
	}

	if (!project) {
		return (
			<div className="container py-20 text-center text-white">
				Projeto não encontrado
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#0B0E14] text-white">
			{/* Hero Header */}
			<div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
				{project.coverUrl && (
					<div className="absolute inset-0">
						<img
							src={project.coverUrl}
							alt={project.title}
							className="w-full h-full object-cover opacity-40 brightness-75 transition-all duration-700 hover:scale-105"
						/>
						{/* Camada de filtro extra */}
						<div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14]/20 via-transparent to-[#0B0E14]" />
					</div>
				)}
				<div className="absolute bottom-0 left-0 w-full p-8 container mx-auto">
					<Button
						variant="ghost"
						size="sm"
						asChild
						className="mb-6 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
					>
						<Link to="/" className="flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" /> Voltar para
							Projetos
						</Link>
					</Button>
					<h1 className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00E5FF] to-[#7B61FF]">
						{project.title}
					</h1>
					<div className="flex flex-wrap gap-3">
						{project.technologies?.split(",").map((tech) => (
							<Badge
								key={tech.trim()}
								variant="secondary"
								className="bg-white/5 border-white/10 text-white px-4 py-1"
							>
								{tech.trim()}
							</Badge>
						))}
					</div>
				</div>
			</div>

			<div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
				<div className="lg:col-span-2">
					<div className="prose prose-invert prose-lg max-w-none text-slate-300">
						<h2 className="text-2xl font-bold text-white mb-6">
							Sobre o Projeto
						</h2>
						<div className="whitespace-pre-wrap leading-relaxed">
							{project.description}
						</div>
					</div>
				</div>
				<div className="space-y-8">
					<div className="p-8 rounded-3xl border border-white/5 bg-[#14181F] shadow-2xl">
						<h3 className="font-bold text-xl mb-6 text-white">
							Links e Demonstração
						</h3>
						<div className="space-y-4">
							{project.liveUrl && (
								<Button
									className="w-full h-14 rounded-2xl gap-3 bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] text-white font-bold text-lg shadow-lg hover:opacity-90 transition-all"
									asChild
								>
									<a
										href={project.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-5 w-5" /> Ver
										Site Online
									</a>
								</Button>
							)}
							{project.repoUrl && (
								<Button
									variant="outline"
									className="w-full h-14 rounded-2xl gap-3 border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold transition-all text-lg"
									asChild
								>
									<a
										href={project.repoUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Github className="h-5 w-5" /> Código
										Fonte
									</a>
								</Button>
							)}
							{!project.liveUrl && !project.repoUrl && (
								<p className="text-slate-500 text-sm text-center">
									Nenhum link disponível para este projeto.
								</p>
							)}
						</div>
					</div>

					{project.shortDescription && (
						<div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
							<p className="text-slate-400 italic leading-relaxed font-medium">
								"{project.shortDescription}"
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProjectDetails;
