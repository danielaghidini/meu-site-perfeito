import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
	{ href: "/#sobre", label: "Sobre" },
	{ href: "/#servicos", label: "Serviços" },
	{ href: "/#projetos", label: "Projetos" },
	{ href: "/blog", label: "Blog" },
	{ href: "/#contato", label: "Contato" },
];

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Helper to handle navigation logic
	const NavItem = ({
		href,
		label,
		className,
		onClick,
	}: {
		href: string;
		label: string;
		className?: string;
		onClick?: () => void;
	}) => {
		const isHome = location.pathname === "/";
		const isAnchor = href.startsWith("/#");

		// If it's an anchor link and we are on home: use plain anchor href="#target"
		// If it's an anchor link and not on home: use Link to="/#target" (handled by simple href string)
		// If it's a route (like /blog): use Link to="/blog"

		if (isAnchor && isHome) {
			return (
				<a
					href={href.replace("/", "")}
					className={className}
					onClick={onClick}
				>
					{label}
				</a>
			);
		}

		return (
			<Link to={href} className={className} onClick={onClick}>
				{label}
			</Link>
		);
	};

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6 }}
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled ? "glass py-3" : "py-5"
			}`}
		>
			<div className="container mx-auto px-6 flex items-center justify-between">
				<Link to="/" className="flex items-center">
					<img
						src={logo}
						alt="Meu Site Perfeito"
						className="h-12 md:h-16"
					/>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-8">
					{navLinks.map((link) => (
						<NavItem
							key={link.href}
							href={link.href}
							label={link.label}
							className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-base font-medium"
						/>
					))}
					<Button variant="hero" size="lg" asChild>
						<a
							href={
								location.pathname === "/"
									? "#contato"
									: "/#contato"
							}
						>
							Solicitar Orçamento
						</a>
					</Button>
				</nav>

				{/* Mobile Menu Button */}
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					{isMobileMenuOpen ? <X /> : <Menu />}
				</Button>
			</div>

			{/* Mobile Navigation */}
			{isMobileMenuOpen && (
				<motion.nav
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="md:hidden glass mt-4 mx-6 rounded-xl p-6"
				>
					<div className="flex flex-col gap-4">
						{navLinks.map((link) => (
							<NavItem
								key={link.href}
								href={link.href}
								label={link.label}
								onClick={() => setIsMobileMenuOpen(false)}
								className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-lg font-medium py-2"
							/>
						))}
						<Button
							variant="hero"
							size="lg"
							className="mt-2"
							asChild
						>
							<a
								href={
									location.pathname === "/"
										? "#contato"
										: "/#contato"
								}
							>
								Solicitar Orçamento
							</a>
						</Button>
					</div>
				</motion.nav>
			)}
		</motion.header>
	);
};

export default Header;
