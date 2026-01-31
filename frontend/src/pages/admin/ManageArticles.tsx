import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Edit, BookOpen } from "lucide-react";
import { getPosts, Post, deletePost } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ManageArticles = () => {
	const [articles, setArticles] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { token } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		loadArticles();
	}, []);

	const loadArticles = async () => {
		setIsLoading(true);
		try {
			const data = await getPosts();
			setArticles(data);
		} catch (error) {
			toast.error("Erro ao carregar artigos");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteArticle = async (id: string) => {
		if (
			!window.confirm("Tem certeza que deseja excluir este artigo?") ||
			!token
		)
			return;

		const success = await deletePost(id, token);
		if (success) {
			toast.success("Artigo excluído!");
			loadArticles();
		} else {
			toast.error("Erro ao excluir artigo");
		}
	};

	return (
		<div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 font-inter">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-4xl font-bold text-white font-sora tracking-tight">
						Gerenciar Blog
					</h1>
					<p className="text-slate-400 text-lg mt-2">
						Escreva e gerencie seus artigos e novidades.
					</p>
				</div>
				<Button
					onClick={() => navigate("/painel/posts/novo")}
					className="bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] hover:opacity-90 text-white font-bold gap-2 h-12 px-8 rounded-2xl transition-all shadow-[0_0_25px_rgba(0,229,255,0.15)]"
				>
					<Plus size={20} />
					Novo Artigo
				</Button>
			</div>

			{isLoading ? (
				<div className="py-24 text-center text-slate-500 font-medium">
					Carregando seus artigos...
				</div>
			) : articles.length === 0 ? (
				<div className="py-24 bg-[#14181F] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center px-4 shadow-xl">
					<div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
						<BookOpen className="text-slate-600" size={40} />
					</div>
					<h3 className="text-2xl font-bold text-white font-sora">
						Nenhum artigo publicado
					</h3>
					<p className="text-slate-400 max-w-sm mb-8 mt-2">
						O seu blog está ansioso por conteúdo de qualidade! Que
						tal começar agora?
					</p>
					<Button
						variant="outline"
						onClick={loadArticles}
						className="border-white/10 text-white hover:bg-white/5 rounded-xl px-8 h-12"
					>
						Atualizar Lista
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4">
					{articles.map((article) => (
						<Card
							key={article.id}
							className="overflow-hidden border border-white/5 bg-[#14181F] group hover:border-[#00E5FF]/20 transition-all duration-300 rounded-2xl shadow-xl"
						>
							<CardContent className="p-0">
								<div className="flex flex-col md:flex-row items-center gap-6 p-6">
									<div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
										{article.coverUrl ? (
											<img
												src={article.coverUrl}
												alt={article.title}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-slate-600">
												<BookOpen size={30} />
											</div>
										)}
									</div>
									<div className="flex-grow min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase font-black tracking-widest text-[#00E5FF]/80">
												{article.tags ||
													"Sem Categoria"}
											</span>
											{article.published ? (
												<span className="text-[10px] bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded uppercase font-black tracking-widest text-green-500">
													Publicado
												</span>
											) : (
												<span className="text-[10px] bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded uppercase font-black tracking-widest text-yellow-500">
													Rascunho
												</span>
											)}
											<span className="text-xs text-slate-500">
												{article.publishedAt &&
													format(
														new Date(
															article.publishedAt,
														),
														"dd/MM/yyyy",
														{ locale: ptBR },
													)}
											</span>
										</div>
										<h3 className="font-bold text-xl text-white font-sora tracking-tight truncate">
											{article.title}
										</h3>
										<p className="text-sm text-slate-400 line-clamp-1 mt-1 leading-relaxed">
											{article.excerpt}
										</p>
									</div>
									<div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
										<Button
											size="sm"
											variant="secondary"
											onClick={() =>
												navigate(
													`/painel/posts/${article.slug}`,
												)
											}
											className="flex-grow md:flex-initial rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/5"
										>
											<Edit size={16} className="mr-2" />
											Editar
										</Button>
										<Button
											size="icon"
											variant="destructive"
											onClick={() =>
												handleDeleteArticle(article.id)
											}
											className="rounded-xl h-9 w-9 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
										>
											<Trash2 size={16} />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default ManageArticles;
