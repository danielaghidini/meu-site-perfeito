import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getProjects, Project } from "@/services/api";

const ProjectsSection = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const data = await getProjects();
				// No backend, podemos filtrar apenas os destacados se quisermos
				setProjects(data);
			} catch (error) {
				console.error("Erro ao carregar projetos:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProjects();
	}, []);

	return (
		<section id="projetos" className="py-20 md:py-24 relative" ref={ref}>
			{/* Background decoration */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-6 relative z-10">
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={isInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<span className="text-primary font-medium text-sm tracking-wider uppercase">
							Portfólio
						</span>
						<h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
							Projetos em{" "}
							<span className="text-gradient">destaque</span>
						</h2>
						<p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
							Conheça alguns dos sites que desenvolvemos para
							nossos clientes. Cada projeto é único e
							personalizado.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{isLoading ? (
							[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-96 bg-card/50 rounded-2xl animate-pulse border border-border/50"
								/>
							))
						) : projects.length === 0 ? (
							<div className="col-span-full text-center py-20 text-muted-foreground">
								Nenhum projeto encontrado.
							</div>
						) : (
							projects.map((project, index) => (
								<motion.article
									key={project.id}
									initial={{ opacity: 0, y: 50 }}
									animate={
										isInView ? { opacity: 1, y: 0 } : {}
									}
									transition={{
										duration: 0.6,
										delay: 0.2 + index * 0.1,
									}}
									className="group bg-gradient-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500"
								>
									<div className="relative overflow-hidden">
										{project.coverUrl ? (
											<img
												src={project.coverUrl}
												alt={project.title}
												className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 filter brightness-90 contrast-110"
											/>
										) : (
											<div className="w-full h-48 bg-slate-800 flex items-center justify-center text-slate-500">
												Sem Capa
											</div>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
									</div>

									<div className="p-6 space-y-4">
										<h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors duration-300">
											{project.title}
										</h3>
										<p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
											{project.shortDescription}
										</p>

										<div className="flex flex-wrap gap-2">
											{project.technologies
												?.split(",")
												.map((tag) => (
													<span
														key={tag.trim()}
														className="px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium"
													>
														{tag.trim()}
													</span>
												))}
										</div>

										<div className="flex gap-3 pt-2">
											<Button
												variant="outline"
												size="sm"
												asChild
											>
												<Link
													to={`/project/${project.slug}`}
												>
													<ExternalLink className="w-4 h-4" />
													Ver Detalhes
												</Link>
											</Button>
											{project.liveUrl && (
												<Button
													variant="ghost"
													size="sm"
													asChild
												>
													<a
														href={project.liveUrl}
														target="_blank"
														rel="noopener noreferrer"
													>
														Demo
													</a>
												</Button>
											)}
										</div>
									</div>
								</motion.article>
							))
						)}
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : {}}
						transition={{ duration: 0.6, delay: 0.8 }}
						className="text-center mt-12"
					>
						<Button variant="hero-outline" size="lg" asChild>
							<a href="#contato">Quero um site assim</a>
						</Button>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default ProjectsSection;
