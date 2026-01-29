import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Palette, Zap, Users } from "lucide-react";

const highlights = [
	{
		icon: Code2,
		title: "Tecnologia de Ponta",
		description:
			"React, Next.js, TypeScript e as melhores práticas do mercado.",
	},
	{
		icon: Palette,
		title: "Design Exclusivo",
		description:
			"Interfaces únicas que refletem a identidade da sua marca.",
	},
	{
		icon: Zap,
		title: "Alta Performance",
		description: "Sites rápidos, otimizados para SEO e conversão.",
	},
	{
		icon: Users,
		title: "Suporte Dedicado",
		description: "Acompanhamento em todas as etapas do seu projeto.",
	},
];

const AboutSection = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section id="sobre" className="py-20 md:py-24 relative" ref={ref}>
			<div className="container mx-auto px-6">
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={isInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<span className="text-primary font-medium text-sm tracking-wider uppercase">
							Sobre Nós
						</span>
						<h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
							Por que escolher a{" "}
							<span className="text-gradient">
								Meu Site Perfeito?
							</span>
						</h2>
					</motion.div>

					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={isInView ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="space-y-6"
						>
							<p className="text-lg text-muted-foreground leading-relaxed">
								Somos especialistas em criar sites que realmente
								funcionam. Combinamos as tecnologias mais
								modernas do mercado com design estratégico para
								entregar resultados excepcionais.
							</p>
							<p className="text-lg text-muted-foreground leading-relaxed">
								Nossa abordagem integra React com CMS Headless
								(como WordPress, Strapi ou Sanity) ou
								desenvolvemos um painel administrativo
								totalmente personalizado para as necessidades do
								seu negócio.
							</p>
							<p className="text-lg text-muted-foreground leading-relaxed">
								Cada projeto é otimizado para SEO desde o
								início, garantindo que seu site seja encontrado
								pelos seus clientes no Google e em outros
								buscadores.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={isInView ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="grid grid-cols-2 gap-4"
						>
							{highlights.map((item, index) => (
								<motion.div
									key={item.title}
									initial={{ opacity: 0, y: 20 }}
									animate={
										isInView ? { opacity: 1, y: 0 } : {}
									}
									transition={{
										duration: 0.4,
										delay: 0.5 + index * 0.1,
									}}
									className="bg-gradient-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors duration-300"
								>
									<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
										<item.icon className="w-6 h-6 text-primary" />
									</div>
									<h3 className="font-display font-semibold text-base mb-2">
										{item.title}
									</h3>
									<p className="text-muted-foreground text-sm">
										{item.description}
									</p>
								</motion.div>
							))}
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutSection;
