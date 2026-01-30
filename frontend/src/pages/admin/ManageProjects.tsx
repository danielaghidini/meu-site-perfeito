import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Edit } from "lucide-react";
import { getProjects, Project, deleteProject } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import ProjectForm from "@/components/admin/ProjectForm";

const ManageProjects = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const { token } = useAuth();

	useEffect(() => {
		loadProjects();
	}, []);

	const loadProjects = async () => {
		setIsLoading(true);
		try {
			const data = await getProjects();
			setProjects(data);
		} catch (error) {
			toast.error("Erro ao carregar projetos");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteProject = async (id: string) => {
		if (
			!window.confirm("Tem certeza que deseja excluir este projeto?") ||
			!token
		)
			return;

		const success = await deleteProject(id, token);
		if (success) {
			toast.success("Projeto excluído!");
			loadProjects();
		} else {
			toast.error("Erro ao excluir projeto");
		}
	};

	return (
		<div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 font-inter">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-4xl font-bold text-white font-sora tracking-tight">
						Meu Portfólio
					</h1>
					<p className="text-slate-400 text-lg mt-2">
						Gerencie os projetos que aparecem no seu site.
					</p>
				</div>
				<Button
					onClick={() => setIsFormOpen(true)}
					className="bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] hover:opacity-90 text-[#0B0E14] font-bold gap-2 h-12 px-8 rounded-2xl transition-all shadow-[0_0_25px_rgba(0,229,255,0.15)]"
				>
					<Plus size={20} />
					Novo Projeto
				</Button>
			</div>

			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<DialogContent className="max-w-3xl bg-[#14181F] border-white/5 text-white rounded-3xl p-8 overflow-y-auto max-h-[90vh]">
					<DialogHeader>
						<DialogTitle className="text-3xl font-bold font-sora">
							Novo Projeto
						</DialogTitle>
						<DialogDescription className="text-slate-400">
							Preencha os detalhes do projeto para adicioná-lo ao
							portfólio.
						</DialogDescription>
					</DialogHeader>
					<ProjectForm
						onSuccess={() => {
							setIsFormOpen(false);
							loadProjects();
						}}
						onCancel={() => setIsFormOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			{isLoading ? (
				<div className="py-24 text-center text-slate-500 font-medium">
					Carregando seus projetos maravilhosos...
				</div>
			) : projects.length === 0 ? (
				<div className="py-24 bg-[#14181F] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center px-4 shadow-xl">
					<div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
						<Plus className="text-slate-600" size={40} />
					</div>
					<h3 className="text-2xl font-bold text-white font-sora">
						Nenhum projeto ainda
					</h3>
					<p className="text-slate-400 max-w-sm mb-8 mt-2">
						Comece agora mesmo a mostrar para o mundo os seus
						trabalhos incríveis.
					</p>
					<Button
						variant="outline"
						onClick={loadProjects}
						className="border-white/10 text-white hover:bg-white/5 rounded-xl px-8 h-12"
					>
						Atualizar Lista
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((proj) => (
						<Card
							key={proj.id}
							className="overflow-hidden border border-white/5 bg-[#14181F] group hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-500 rounded-2xl shadow-xl"
						>
							<div className="aspect-video relative overflow-hidden bg-slate-800">
								{proj.coverUrl ? (
									<img
										src={proj.coverUrl}
										alt={proj.title}
										className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-slate-700 font-bold uppercase tracking-widest text-xs">
										Sem Capa
									</div>
								)}
								<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
									<Button
										size="icon"
										variant="secondary"
										className="rounded-full h-12 w-12 bg-white text-[#0B0E14] hover:bg-[#00E5FF] transition-colors"
									>
										<Edit size={20} />
									</Button>
									<Button
										size="icon"
										variant="destructive"
										className="rounded-full h-12 w-12 bg-red-500 hover:bg-red-600 transition-colors"
									>
										<Trash2 size={20} />
									</Button>
								</div>
							</div>
							<CardContent className="p-6">
								<h3 className="font-bold text-xl text-white font-sora tracking-tight">
									{proj.title}
								</h3>
								<p className="text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">
									{proj.shortDescription}
								</p>
								<div className="mt-6 flex flex-wrap gap-2">
									{proj.technologies
										?.split(",")
										.map((tech) => (
											<span
												key={tech}
												className="text-[10px] bg-white/5 border border-white/5 px-2.5 py-1 rounded-md uppercase font-black tracking-widest text-[#00E5FF]/80 shadow-sm"
											>
												{tech.trim()}
											</span>
										))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default ManageProjects;
