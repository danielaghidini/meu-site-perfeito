import { Heart } from "lucide-react";
import logo from "@/assets/logo.png";

interface FooterProps {
	simple?: boolean;
}

const Footer = ({ simple = false }: FooterProps) => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="py-8 border-t border-border/50">
			<div className="container mx-auto px-6">
				<div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 text-center md:text-left">
					<div className="flex items-center justify-center md:justify-start">
						<img
							src={logo}
							alt="Meu Site Perfeito"
							className="h-10"
						/>
					</div>

					<p className="text-muted-foreground text-sm flex items-center justify-center flex-wrap gap-1 max-w-[250px] md:max-w-none mx-auto md:mx-0 leading-relaxed">
						<span>© {currentYear} Meu Site Perfeito.</span>
						<span className="flex items-center gap-1">
							Feito com{" "}
							<Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />{" "}
							no Brasil.
						</span>
					</p>

					{!simple && (
						<nav className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2">
							<a
								href="#sobre"
								className="text-muted-foreground hover:text-foreground transition-colors text-sm"
							>
								Sobre
							</a>
							<a
								href="#servicos"
								className="text-muted-foreground hover:text-foreground transition-colors text-sm"
							>
								Serviços
							</a>
							<a
								href="#projetos"
								className="text-muted-foreground hover:text-foreground transition-colors text-sm"
							>
								Projetos
							</a>
							<a
								href="/blog"
								className="text-muted-foreground hover:text-foreground transition-colors text-sm"
							>
								Blog
							</a>
							<a
								href="/politica-de-privacidade"
								className="text-muted-foreground hover:text-foreground transition-colors text-sm"
							>
								Privacidade
							</a>
							<a
								href="#contato"
								className="text-muted-foreground hover:text-foreground transition-colors text-sm"
							>
								Contato
							</a>
						</nav>
					)}
				</div>
			</div>
		</footer>
	);
};

export default Footer;
