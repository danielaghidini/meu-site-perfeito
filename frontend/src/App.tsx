import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import SinglePost from "./pages/SinglePost";
import ProjectDetails from "./pages/ProjectDetails";
import NotFound from "./pages/NotFound";

const App = () => (
	<TooltipProvider>
		<Toaster />
		<Sonner />
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/blog" element={<Blog />} />
				<Route path="/blog/:slug" element={<SinglePost />} />
				<Route path="/project/:slug" element={<ProjectDetails />} />
				{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	</TooltipProvider>
);

export default App;
