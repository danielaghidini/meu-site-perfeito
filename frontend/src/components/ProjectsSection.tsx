import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
	{
		title: "E-commerce Moderno",
		description:
			"Loja virtual completa com React e integração ao WordPress como CMS Headless. Sistema de pagamentos, carrinho e gestão de produtos.",
		image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
		tags: ["React", "WordPress API", "Stripe", "SEO"],
		liveUrl: "#",
	},
	{
		title: "Portal de Notícias",
		description:
			"Site de conteúdo com painel administrativo personalizado. Gerenciamento de artigos, categorias e autores com SEO avançado.",
		image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop",
		tags: ["Next.js", "Painel Custom", "PostgreSQL"],
		liveUrl: "#",
	},
	{
		title: "Site Institucional",
		description:
			"Presença digital profissional para empresa de consultoria. Design elegante, formulários de contato e integração com CRM.",
		image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
		tags: ["React", "Tailwind", "Strapi CMS"],
		liveUrl: "#",
	},
];

const ProjectsSection = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

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
						{projects.map((project, index) => (
							<motion.article
								key={project.title}
								initial={{ opacity: 0, y: 50 }}
								animate={isInView ? { opacity: 1, y: 0 } : {}}
								transition={{
									duration: 0.6,
									delay: 0.2 + index * 0.1,
								}}
								className="group bg-gradient-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500"
							>
								<div className="relative overflow-hidden">
									<img
										src={project.image}
										alt={project.title}
										className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
								</div>

								<div className="p-6 space-y-4">
									<h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors duration-300">
										{project.title}
									</h3>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{project.description}
									</p>

									<div className="flex flex-wrap gap-2">
										{project.tags.map((tag) => (
											<span
												key={tag}
												className="px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium"
											>
												{tag}
											</span>
										))}
									</div>

									<div className="flex gap-3 pt-2">
										<Button
											variant="outline"
											size="sm"
											asChild
										>
											<a
												href={project.liveUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												<ExternalLink className="w-4 h-4" />
												Ver Projeto
											</a>
										</Button>
									</div>
								</div>
							</motion.article>
						))}
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
