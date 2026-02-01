import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import WhatsAppButton from "./components/WhatsAppButton";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import SinglePost from "./pages/SinglePost";
import ProjectDetails from "./pages/ProjectDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./contexts/AuthContext";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageContacts from "./pages/admin/ManageContacts";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageArticles from "./pages/admin/ManageArticles";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageSocial from "./pages/admin/ManageSocial";
import EditArticle from "./pages/admin/EditArticle";
import GoogleAnalytics from "./components/GoogleAnalytics";

const ConditionalWhatsAppButton = () => {
	const location = useLocation();
	const isAdminPage = location.pathname.startsWith("/painel");
	return !isAdminPage ? <WhatsAppButton /> : null;
};

const App = () => (
	<AuthProvider>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true,
				}}
			>
				<GoogleAnalytics />
				<ConditionalWhatsAppButton />
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/blog" element={<Blog />} />
					<Route path="/blog/:slug" element={<SinglePost />} />
					<Route path="/project/:slug" element={<ProjectDetails />} />
					<Route
						path="/politica-de-privacidade"
						element={<PrivacyPolicy />}
					/>

					{/* Painel Administrativo */}
					<Route path="/painel/login" element={<AdminLogin />} />
					<Route
						path="/painel"
						element={
							<AdminLayout>
								<Dashboard />
							</AdminLayout>
						}
					/>
					<Route
						path="/painel/social"
						element={
							<AdminLayout>
								<ManageSocial />
							</AdminLayout>
						}
					/>
					<Route
						path="/painel/projetos"
						element={
							<AdminLayout>
								<ManageProjects />
							</AdminLayout>
						}
					/>
					<Route
						path="/painel/contatos"
						element={
							<AdminLayout>
								<ManageContacts />
							</AdminLayout>
						}
					/>
					<Route
						path="/painel/usuarios"
						element={
							<AdminLayout>
								<ManageUsers />
							</AdminLayout>
						}
					/>
					<Route
						path="/painel/posts"
						element={
							<AdminLayout>
								<ManageArticles />
							</AdminLayout>
						}
					/>
					<Route
						path="/painel/posts/:slug"
						element={
							<AdminLayout>
								<EditArticle />
							</AdminLayout>
						}
					/>
					<Route
						path="/painel/categorias"
						element={
							<AdminLayout>
								<ManageCategories />
							</AdminLayout>
						}
					/>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</AuthProvider>
);

export default App;
