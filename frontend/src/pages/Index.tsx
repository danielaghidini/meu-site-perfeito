import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CookieConsent from "@/components/CookieConsent";
import SEO from "@/components/SEO";

const Index = () => {
	return (
		<div className="min-h-screen bg-background overflow-x-hidden">
			<SEO
				title="Criação de Sites Modernos e SEO"
				description="Transformamos ideias em sites perfeitos. Desenvolvimento com React, Next.js e SEO otimizado para o seu negócio crescer."
			/>
			<Header />
			<CookieConsent />
			<main className="overflow-hidden">
				<HeroSection />
				<AboutSection />
				<SkillsSection />
				<ProjectsSection />
				<ContactSection />
			</main>
			<Footer />
		</div>
	);
};

export default Index;
