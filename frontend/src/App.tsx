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
								<div className="text-slate-500 py-20 text-center">
									Gerenciamento de posts chegando em breve...
								</div>
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
