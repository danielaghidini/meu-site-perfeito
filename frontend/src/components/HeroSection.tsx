import { motion } from "framer-motion";
import { ArrowDown, Rocket, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
			{/* Background Effects */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
				<div
					className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse-glow"
					style={{ animationDelay: "1.5s" }}
				/>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[600px] aspect-square border border-border/20 rounded-full opacity-20 md:opacity-100" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] aspect-square border border-border/10 rounded-full opacity-10 md:opacity-100" />
			</div>

			<div className="container mx-auto px-6 relative z-10">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="mb-6"
					>
						<span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary font-medium">
							Desenvolvimento Web Profissional
						</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
					>
						Transformamos ideias em{" "}
						<span className="text-gradient">sites perfeitos</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
					>
						Desenvolvemos sites modernos com React, integração a CMS
						Headless ou painel administrativo personalizado,
						totalmente otimizados para SEO e preparados para escalar
						o seu negócio.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
					>
						<Button
							variant="hero"
							size="xl"
							asChild
							className="whitespace-normal h-auto py-4 px-8 min-w-[200px]"
						>
							<a href="#contato">Solicitar Orçamento</a>
						</Button>
						<Button
							variant="hero-outline"
							size="xl"
							asChild
							className="whitespace-normal h-auto py-4 px-8 min-w-[200px]"
						>
							<a href="#projetos">Ver Projetos</a>
						</Button>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
					>
						<div className="flex items-center gap-2">
							<Code className="w-5 h-5 text-primary" />
							<span className="text-sm">React & Next.js</span>
						</div>
						<div className="flex items-center gap-2">
							<Rocket className="w-5 h-5 text-primary" />
							<span className="text-sm">SEO Otimizado</span>
						</div>
						<div className="flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-primary" />
							<span className="text-sm">Design Exclusivo</span>
						</div>
					</motion.div>
				</div>

				{/* Scroll Indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.8 }}
					className="absolute bottom-10 left-1/2 -translate-x-1/2"
				>
					<motion.div
						animate={{ y: [0, 10, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
					>
						<ArrowDown className="w-6 h-6 text-muted-foreground" />
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default HeroSection;
