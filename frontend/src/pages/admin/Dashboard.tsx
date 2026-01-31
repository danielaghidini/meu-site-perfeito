import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/useAuth";
import {
	FileText,
	Briefcase,
	PlusCircle,
	MessageSquare,
	Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboardStats, DashboardStats } from "@/services/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
	const { user, token: contextToken } = useAuth();
	const [data, setData] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			const token = contextToken || localStorage.getItem("token");
			if (token) {
				try {
					console.log("Fetching dashboard stats...");
					const stats = await getDashboardStats(token);
					if (stats) {
						setData(stats);
						setError(null);
					} else {
						setError("Falha ao carregar dados.");
					}
				} catch (err) {
					console.error("Fetch error:", err);
					setError("Erro na requisição.");
				}
			} else {
				setError("Sessão expirada.");
			}
			setLoading(false);
		};

		fetchStats();
	}, [contextToken]);

	const stats = [
		{
			label: "Posts Publicados",
			value: data?.stats.articles || 0,
			icon: <FileText className="text-blue-500" />,
			color: "blue",
			path: "/painel/posts",
		},
		{
			label: "Projetos no Portfólio",
			value: data?.stats.projects || 0,
			icon: <Briefcase className="text-purple-500" />,
			color: "purple",
			path: "/painel/projetos",
		},
		{
			label: "Novas Mensagens",
			value: data?.stats.newContacts || 0,
			icon: <MessageSquare className="text-emerald-500" />,
			color: "emerald",
			path: "/painel/contatos",
		},
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E5FF]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-96 space-y-4">
				<p className="text-red-500 font-medium">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white"
				>
					Tentar Novamente
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-10 animate-in fade-in duration-700 font-inter">
			<div>
				<h1 className="text-4xl font-bold text-white font-sora tracking-tight">
					Olá, {user?.name}! 😊
				</h1>
				<p className="text-slate-400 text-lg mt-2">
					O que vamos criar hoje para o seu site perfeito?
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, idx) => (
					<Link to={stat.path} key={idx}>
						<Card className="border border-white/5 bg-[#14181F] shadow-xl rounded-2xl overflow-hidden group hover:border-white/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all cursor-pointer h-full">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
									{stat.label}
								</CardTitle>
								<div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 group-hover:bg-white/10 transition-all">
									{stat.icon}
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-4xl font-bold text-white font-sora group-hover:text-[#00E5FF] transition-colors">
									{stat.value}
								</div>
							</CardContent>
						</Card>
					</Link>
				))}

				<Card className="border-dashed border-2 border-white/5 bg-transparent flex items-center justify-center p-6 text-center shadow-none hover:border-[#00E5FF]/30 transition-all group rounded-2xl h-full">
					<div className="space-y-4">
						<div className="flex flex-col items-center">
							<span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
								Ações Rápidas
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<Link to="/painel/posts?action=new">
								<button className="w-full text-xs font-bold bg-white/5 hover:bg-[#00E5FF] hover:text-[#0B0E14] text-white px-4 py-2 rounded-xl cursor-pointer transition-all border border-white/5 flex items-center justify-center gap-2">
									<PlusCircle size={14} /> Novo Post
								</button>
							</Link>
							<Link to="/painel/projetos?action=new">
								<button className="w-full text-xs font-bold bg-white/5 hover:bg-[#7B61FF] hover:text-[#0B0E14] text-white px-4 py-2 rounded-xl cursor-pointer transition-all border border-white/5 flex items-center justify-center gap-2">
									<PlusCircle size={14} /> Novo Projeto
								</button>
							</Link>
						</div>
					</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					<h2 className="text-xl font-bold text-white flex items-center gap-2">
						<Clock size={20} className="text-[#00E5FF]" />
						Atividades Recentes
					</h2>

					<div className="bg-[#14181F] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
						{data?.activities && data.activities.length > 0 ? (
							<div className="divide-y divide-white/5">
								{data.activities.map((activity) => (
									<div
										key={`${activity.type}-${activity.id}`}
										className="p-5 hover:bg-white/5 transition-colors flex items-center justify-between group"
									>
										<div className="flex items-center gap-4">
											<div
												className={`p-2 rounded-xl ${
													activity.type === "article"
														? "bg-blue-500/10 text-blue-500"
														: activity.type ===
															  "project"
															? "bg-purple-500/10 text-purple-500"
															: "bg-emerald-500/10 text-emerald-500"
												}`}
											>
												{activity.type === "article" ? (
													<FileText size={18} />
												) : activity.type ===
												  "project" ? (
													<Briefcase size={18} />
												) : (
													<MessageSquare size={18} />
												)}
											</div>
											<div>
												<p className="text-white font-medium group-hover:text-[#00E5FF] transition-colors">
													{activity.title}
												</p>
												<p className="text-sm text-slate-500 capitalize">
													{activity.type === "article"
														? "Blog Post"
														: activity.type ===
															  "project"
															? "Projeto"
															: "Mensagem de Contato"}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-xs text-slate-400">
												{formatDistanceToNow(
													new Date(activity.date),
													{
														addSuffix: true,
														locale: ptBR,
													},
												)}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="py-20 text-center">
								<p className="text-slate-500 font-medium">
									Nenhuma atividade recente encontrada.
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="space-y-6">
					<h3 className="text-xl font-bold text-white">
						Status do Site
					</h3>
					<div className="bg-[#14181F] p-6 rounded-3xl border border-white/5 shadow-2xl space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-slate-400 text-sm">
								Visibilidade
							</span>
							<span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
								Público
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-slate-400 text-sm">
								SSL / HTTPS
							</span>
							<span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
								Ativo
							</span>
						</div>
						<div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
							<span className="text-slate-400 text-sm">
								Base de Dados
							</span>
							<span className="text-white text-xs font-medium">
								Conectado (PostgreSQL)
							</span>
						</div>
					</div>

					<div className="bg-gradient-to-br from-[#00E5FF]/10 to-transparent p-6 rounded-3xl border border-[#00E5FF]/20 shadow-2xl">
						<h4 className="text-white font-bold mb-2">
							Dica do Dia 💡
						</h4>
						<p className="text-slate-400 text-sm leading-relaxed">
							Tente usar a <b>IA Geradora</b> para criar rascunhos
							rápidos para seus novos posts de blog. Isso
							economiza muito tempo!
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
