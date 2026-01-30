import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
	return (
		<div className="min-h-screen bg-background overflow-x-hidden">
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
