import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, FolderPlus } from "lucide-react";
import {
	getCategories,
	createCategory,
	deleteCategory,
	Category,
} from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/useAuth";

const ManageCategories = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { token } = useAuth();

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		setIsLoading(true);
		try {
			const data = await getCategories();
			setCategories(data);
		} catch (error) {
			toast.error("Erro ao carregar categorias");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newCategoryName.trim() || !token) return;

		setIsSubmitting(true);
		try {
			const category = await createCategory(
				{ name: newCategoryName.trim() },
				token,
			);
			if (category) {
				toast.success("Categoria criada!");
				setNewCategoryName("");
				loadCategories();
			} else {
				toast.error("Erro ao criar categoria");
			}
		} catch (error) {
			toast.error("Erro ao criar categoria");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteCategory = async (id: string, name: string) => {
		if (
			!window.confirm(
				`Tem certeza que deseja excluir a categoria "${name}"? Os artigos marcados nela ficarão sem categoria.`,
			) ||
			!token
		)
			return;

		const success = await deleteCategory(id, token);
		if (success) {
			toast.success("Categoria excluída!");
			loadCategories();
		} else {
			toast.error("Erro ao excluir categoria");
		}
	};

	return (
		<div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 font-inter">
			<div>
				<h1 className="text-4xl font-bold text-white font-sora tracking-tight">
					Categorias do Blog
				</h1>
				<p className="text-slate-400 text-lg mt-2">
					Gerencie os tópicos de organização do seu conteúdo.
				</p>
			</div>

			<Card className="border border-white/5 bg-[#14181F] rounded-3xl overflow-hidden shadow-2xl">
				<CardContent className="p-8">
					<form
						onSubmit={handleCreateCategory}
						className="flex gap-4"
					>
						<div className="relative flex-grow">
							<Input
								placeholder="Nome da nova categoria..."
								value={newCategoryName}
								onChange={(e) =>
									setNewCategoryName(e.target.value)
								}
								className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-2xl h-14 pl-12 text-white"
							/>
							<div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
								<FolderPlus size={20} />
							</div>
						</div>
						<Button
							type="submit"
							disabled={isSubmitting || !newCategoryName.trim()}
							className="bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] hover:opacity-90 text-white font-bold gap-2 h-14 px-8 rounded-2xl transition-all shadow-[0_0_25px_rgba(0,229,255,0.15)]"
						>
							<Plus size={20} />
							Adicionar
						</Button>
					</form>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{isLoading ? (
					[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-24 bg-white/5 animate-pulse rounded-2xl"
						/>
					))
				) : categories.length === 0 ? (
					<div className="col-span-full py-12 text-center text-slate-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
						Nenhuma categoria cadastrada ainda.
					</div>
				) : (
					categories.map((category) => (
						<Card
							key={category.id}
							className="border border-white/5 bg-[#14181F] hover:border-[#00E5FF]/20 transition-all rounded-2xl group shadow-lg"
						>
							<CardContent className="p-6 flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF]/20 to-[#7B61FF]/20 rounded-xl flex items-center justify-center text-[#00E5FF]">
										<span className="font-bold text-lg">
											{category.name
												.charAt(0)
												.toUpperCase()}
										</span>
									</div>
									<h3 className="font-bold text-white text-lg tracking-tight">
										{category.name}
									</h3>
								</div>
								<Button
									variant="secondary"
									size="icon"
									onClick={() =>
										handleDeleteCategory(
											category.id,
											category.name,
										)
									}
									className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl h-10 w-10 border border-red-500/20 opacity-0 group-hover:opacity-100"
								>
									<Trash2 size={18} />
								</Button>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
};

export default ManageCategories;
