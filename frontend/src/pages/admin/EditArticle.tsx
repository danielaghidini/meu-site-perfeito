import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostBySlug, Post } from "@/services/api";
import ArticleForm from "@/components/admin/ArticleForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const EditArticle = () => {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();
	const [article, setArticle] = useState<Post | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (slug && slug !== "novo") {
			loadArticle();
		}
	}, [slug]);

	const loadArticle = async () => {
		setIsLoading(true);
		try {
			const data = await getPostBySlug(slug!);
			if (data) {
				setArticle(data);
			} else {
				toast.error("Artigo não encontrado");
				navigate("/painel/posts");
			}
		} catch (error) {
			toast.error("Erro ao carregar artigo");
			navigate("/painel/posts");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 font-inter">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<Button
						variant="ghost"
						onClick={() => navigate("/painel/posts")}
						className="pl-0 text-slate-400 hover:text-white hover:bg-transparent mb-2"
					>
						<ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a
						lista
					</Button>
					<h1 className="text-4xl font-bold text-white font-sora tracking-tight">
						{slug === "novo" ? "Novo Artigo" : "Editar Artigo"}
					</h1>
					<p className="text-slate-400 text-lg mt-2">
						{slug === "novo"
							? "Compartilhe suas ideias e novidades com o mundo."
							: `Editando: ${article?.title || "..."}`}
					</p>
				</div>
			</div>

			<div className="bg-[#14181F] border border-white/5 rounded-3xl p-8 shadow-2xl">
				{isLoading ? (
					<div className="py-20 text-center text-slate-500">
						Carregando dados do artigo...
					</div>
				) : (
					<ArticleForm
						article={article}
						onSuccess={() => navigate("/painel/posts")}
						onCancel={() => navigate("/painel/posts")}
					/>
				)}
			</div>
		</div>
	);
};

export default EditArticle;
