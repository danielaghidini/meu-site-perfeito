import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Briefcase, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
	const { user } = useAuth();

	const stats = [
		{
			label: "Posts Publicados",
			value: "0",
			icon: <FileText className="text-blue-500" />,
		},
		{
			label: "Projetos no Portfólio",
			value: "0",
			icon: <Briefcase className="text-purple-500" />,
		},
	];

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

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{stats.map((stat, idx) => (
					<Card
						key={idx}
						className="border border-white/5 bg-[#14181F] shadow-xl rounded-2xl"
					>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
								{stat.label}
							</CardTitle>
							<div className="p-2 bg-white/5 rounded-lg">
								{stat.icon}
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-4xl font-bold text-white font-sora">
								{stat.value}
							</div>
						</CardContent>
					</Card>
				))}

				<Card className="border-dashed border-2 border-white/5 bg-transparent flex items-center justify-center p-8 text-center shadow-none hover:border-[#00E5FF]/30 transition-all group rounded-2xl">
					<div className="space-y-6">
						<div className="flex flex-col items-center">
							<PlusCircle
								size={40}
								className="text-white/10 group-hover:text-[#00E5FF] transition-colors"
							/>
							<span className="mt-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
								Ações Rápidas
							</span>
						</div>
						<div className="flex gap-3">
							<Link to="/painel/posts">
								<span className="text-xs font-bold bg-white/5 hover:bg-[#00E5FF] hover:text-[#0B0E14] text-white px-4 py-2 rounded-xl cursor-pointer transition-all border border-white/5">
									Novo Post
								</span>
							</Link>
							<Link to="/painel/projetos">
								<span className="text-xs font-bold bg-white/5 hover:bg-[#7B61FF] hover:text-[#0B0E14] text-white px-4 py-2 rounded-xl cursor-pointer transition-all border border-white/5">
									Novo Projeto
								</span>
							</Link>
						</div>
					</div>
				</Card>
			</div>

			{/* Placeholder for recent activity */}
			<div className="bg-[#14181F] p-10 rounded-3xl border border-white/5 shadow-2xl text-center py-24 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00E5FF]/5 opacity-20" />
				<p className="text-slate-500 font-medium relative z-10">
					Atividades recentes aparecerão aqui assim que você começar a
					criar conteúdo.
				</p>
			</div>
		</div>
	);
};

export default Dashboard;
