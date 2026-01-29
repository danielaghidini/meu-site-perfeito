import { Heart } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="py-8 border-t border-border/50">
			<div className="container mx-auto px-6">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<a href="#" className="flex items-center">
						<img
							src={logo}
							alt="Meu Site Perfeito"
							className="h-10"
						/>
					</a>

					<p className="text-muted-foreground text-sm flex items-center gap-1">
						© {currentYear} Meu Site Perfeito. Feito com{" "}
						<Heart className="w-4 h-4 text-primary fill-primary" />{" "}
						em São Paulo.
					</p>

					<nav className="flex items-center gap-6">
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
							href="#contato"
							className="text-muted-foreground hover:text-foreground transition-colors text-sm"
						>
							Contato
						</a>
					</nav>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
