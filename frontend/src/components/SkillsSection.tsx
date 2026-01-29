import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
	Globe,
	Layers,
	Search,
	Settings,
	Smartphone,
	Gauge,
} from "lucide-react";

const services = [
	{
		icon: Globe,
		title: "Sites Institucionais",
		description:
			"Sites profissionais que transmitem credibilidade e convertem visitantes em clientes.",
	},
	{
		icon: Layers,
		title: "Integração CMS Headless",
		description:
			"WordPress, Strapi, Sanity ou Contentful integrados ao React para gestão de conteúdo fácil.",
	},
	{
		icon: Settings,
		title: "Painel Administrativo",
		description:
			"Sistema personalizado para gerenciar seu site sem depender de plataformas externas.",
	},
	{
		icon: Search,
		title: "Otimização SEO",
		description:
			"Estrutura técnica impecável para seu site aparecer nas primeiras posições do Google.",
	},
	{
		icon: Smartphone,
		title: "Design Responsivo",
		description:
			"Sites que funcionam perfeitamente em todos os dispositivos: desktop, tablet e mobile.",
	},
	{
		icon: Gauge,
		title: "Alta Performance",
		description:
			"Carregamento ultra-rápido com as melhores práticas de otimização web.",
	},
];

const technologies = [
	"React",
	"Next.js",
	"TypeScript",
	"Tailwind CSS",
	"Node.js",
	"WordPress API",
	"Strapi",
	"Sanity",
	"GraphQL",
	"PostgreSQL",
];

const SkillsSection = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section id="servicos" className="py-20 md:py-24 relative" ref={ref}>
			{/* Background decoration */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/2 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
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
							Serviços
						</span>
						<h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
							Soluções completas para{" "}
							<span className="text-gradient">seu negócio</span>
						</h2>
						<p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
							Do planejamento ao lançamento, cuidamos de tudo para
							você ter o site perfeito para sua empresa.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
						{services.map((service, index) => (
							<motion.div
								key={service.title}
								initial={{ opacity: 0, y: 30 }}
								animate={isInView ? { opacity: 1, y: 0 } : {}}
								transition={{
									duration: 0.5,
									delay: 0.2 + index * 0.1,
								}}
								className="bg-gradient-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
							>
								<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
									<service.icon className="w-6 h-6 text-primary" />
								</div>
								<h3 className="font-display font-semibold text-lg mb-2">
									{service.title}
								</h3>
								<p className="text-muted-foreground text-sm">
									{service.description}
								</p>
							</motion.div>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={isInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.6 }}
						className="text-center"
					>
						<h3 className="font-display text-xl font-semibold mb-6">
							Tecnologias que utilizamos
						</h3>
						<div className="flex flex-wrap justify-center gap-3">
							{technologies.map((tech, index) => (
								<motion.span
									key={tech}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={
										isInView ? { opacity: 1, scale: 1 } : {}
									}
									transition={{
										duration: 0.3,
										delay: 0.7 + index * 0.05,
									}}
									className="px-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm font-medium hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 cursor-default"
								>
									{tech}
								</motion.span>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default SkillsSection;
