import React, { useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	FileText,
	Briefcase,
	LogOut,
	Globe,
	Mail,
	Users,
	Tags,
} from "lucide-react";
import logo from "@/assets/logo.png";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, token, logout, isLoading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!isLoading && !token) {
			navigate("/painel/login");
		}
	}, [token, isLoading, navigate]);

	if (isLoading || !token) {
		return (
			<div className="h-screen flex items-center justify-center bg-[#0B0E14]">
				<img
					src={logo}
					alt="Carregando..."
					className="h-16 opacity-30"
				/>
			</div>
		);
	}

	const menuItems = [
		{
			label: "Resumo",
			icon: <LayoutDashboard size={20} />,
			path: "/painel",
		},
		{
			label: "Blog",
			icon: <FileText size={20} />,
			path: "/painel/posts",
		},
		{
			label: "Categorias",
			icon: <Tags size={20} />,
			path: "/painel/categorias",
		},
		{
			label: "Portfólio",
			icon: <Briefcase size={20} />,
			path: "/painel/projetos",
		},
		{
			label: "Contatos",
			icon: <Mail size={20} />,
			path: "/painel/contatos",
		},
		...(user?.role === "ADMIN"
			? [
					{
						label: "Usuários",
						icon: <Users size={20} />,
						path: "/painel/usuarios",
					},
				]
			: []),
	];

	return (
		<div className="min-h-screen bg-[#0B0E14] flex font-outfit text-white">
			{/* Sidebar */}
			<aside className="w-72 bg-[#14181F] border-r border-white/5 hidden md:flex flex-col shadow-2xl">
				<div className="p-10 border-b border-white/5 flex justify-center">
					<img src={logo} alt="Logo" className="h-14" />
				</div>

				<nav className="flex-1 p-6 space-y-3">
					{menuItems.map((item) => {
						const isActive =
							item.path === "/painel"
								? location.pathname === "/painel"
								: location.pathname.startsWith(item.path);

						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
									isActive
										? "bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] text-white font-bold shadow-[0_0_20px_rgba(0,229,255,0.15)]"
										: "text-slate-400 hover:bg-white/5 hover:text-white"
								}`}
							>
								{item.icon}
								<span className="text-base tracking-wide">
									{item.label}
								</span>
							</Link>
						);
					})}
				</nav>

				<div className="p-6 border-t border-white/5 flex flex-col gap-3">
					<Link
						to="/"
						target="_blank"
						className="flex items-center gap-3 px-5 py-2 text-sm text-slate-500 hover:text-[#00E5FF] transition-colors"
					>
						<Globe size={16} />
						Ver Site Público
					</Link>
					<button
						onClick={logout}
						className="flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all w-full font-medium"
					>
						<LogOut size={20} />
						<span>Sair</span>
					</button>
				</div>
			</aside>

			{/* Content */}
			<main className="flex-1 flex flex-col">
				<header className="h-20 bg-[#14181F]/50 backdrop-blur-lg border-b border-white/5 flex items-center justify-end px-10">
					<div className="flex items-center gap-4">
						<div className="flex flex-col items-end">
							<span className="text-sm font-bold text-white leading-none">
								{user?.name}
							</span>
							<span className="text-[10px] text-[#00E5FF] font-bold uppercase tracking-widest mt-1">
								{user?.role}
							</span>
						</div>
						<div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1A1F2C] to-[#0B0E14] border border-white/10 flex items-center justify-center text-white/20">
							<FileText size={20} />
						</div>
					</div>
				</header>

				<div className="p-10 max-w-7xl w-full mx-auto">{children}</div>
			</main>
		</div>
	);
};

export default AdminLayout;
