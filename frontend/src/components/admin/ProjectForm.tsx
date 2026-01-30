import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createProject, updateProject, Project } from "@/services/api";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "sonner";

interface ProjectFormProps {
	project?: Project;
	onSuccess: () => void;
	onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
	project,
	onSuccess,
	onCancel,
}) => {
	const { token } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		shortDescription: "",
		description: "",
		coverUrl: "",
		technologies: "",
		liveUrl: "",
		repoUrl: "",
		isFeatured: false,
	});

	useEffect(() => {
		if (project) {
			setFormData({
				title: project.title || "",
				slug: project.slug || "",
				shortDescription: project.shortDescription || "",
				description: project.description || "",
				coverUrl: project.coverUrl || "",
				technologies: project.technologies || "",
				liveUrl: project.liveUrl || "",
				repoUrl: project.repoUrl || "",
				isFeatured: project.isFeatured || false,
			});
		}
	}, [project]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => {
			const newData = { ...prev, [name]: value };
			// Auto-generate slug from title if slug is empty or was previously auto-generated
			if (
				name === "title" &&
				(!prev.slug ||
					prev.slug ===
						prev.title
							.toLowerCase()
							.replace(/ /g, "-")
							.replace(/[^\w-]+/g, ""))
			) {
				newData.slug = value
					.toLowerCase()
					.replace(/ /g, "-")
					.replace(/[^\w-]+/g, "");
			}
			return newData;
		});
	};

	const handleCheckboxChange = (checked: boolean) => {
		setFormData((prev) => ({ ...prev, isFeatured: checked }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!token) return;

		setIsLoading(true);
		try {
			if (project) {
				const result = await updateProject(project.id, formData, token);
				if (result) {
					toast.success("Projeto atualizado com sucesso!");
					onSuccess();
				} else {
					throw new Error("Falha ao atualizar projeto");
				}
			} else {
				const result = await createProject(formData, token);
				if (result) {
					toast.success("Projeto criado com sucesso!");
					onSuccess();
				} else {
					throw new Error("Falha ao criar projeto");
				}
			}
		} catch (error) {
			toast.error("Erro ao salvar o projeto. Verifique os dados.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 py-4 font-inter text-white"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label htmlFor="title" className="text-slate-400">
						Título do Projeto
					</Label>
					<Input
						id="title"
						name="title"
						value={formData.title}
						onChange={handleChange}
						placeholder="Ex: E-commerce Moderno"
						required
						className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="slug" className="text-slate-400">
						URL Amigável (slug)
					</Label>
					<Input
						id="slug"
						name="slug"
						value={formData.slug}
						onChange={handleChange}
						placeholder="ex-ecommerce-moderno"
						required
						className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="shortDescription" className="text-slate-400">
					Descrição Curta (chamada)
				</Label>
				<Input
					id="shortDescription"
					name="shortDescription"
					value={formData.shortDescription}
					onChange={handleChange}
					placeholder="Uma frase rápida sobre o projeto"
					className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description" className="text-slate-400">
					Descrição Completa
				</Label>
				<Textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					placeholder="Conte mais sobre os desafios e soluções deste projeto..."
					className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] min-h-[120px] rounded-xl"
					required
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label htmlFor="coverUrl" className="text-slate-400">
						Link da Imagem de Capa
					</Label>
					<Input
						id="coverUrl"
						name="coverUrl"
						value={formData.coverUrl}
						onChange={handleChange}
						placeholder="https://imgur.com/..."
						className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="technologies" className="text-slate-400">
						Tecnologias (separadas por vírgula)
					</Label>
					<Input
						id="technologies"
						name="technologies"
						value={formData.technologies}
						onChange={handleChange}
						placeholder="React, Tailwind, Node.js"
						className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label htmlFor="liveUrl" className="text-slate-400">
						Link do Site (Opcional)
					</Label>
					<Input
						id="liveUrl"
						name="liveUrl"
						value={formData.liveUrl}
						onChange={handleChange}
						placeholder="https://..."
						className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="repoUrl" className="text-slate-400">
						Link do Repositório (Opcional)
					</Label>
					<Input
						id="repoUrl"
						name="repoUrl"
						value={formData.repoUrl}
						onChange={handleChange}
						placeholder="https://github.com/..."
						className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12"
					/>
				</div>
			</div>

			<div className="flex items-center space-x-2 pt-2">
				<Checkbox
					id="isFeatured"
					checked={formData.isFeatured}
					onCheckedChange={handleCheckboxChange}
					className="border-white/20 data-[state=checked]:bg-[#00E5FF] data-[state=checked]:text-[#0B0E14]"
				/>
				<Label
					htmlFor="isFeatured"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
				>
					Destacar este projeto na página inicial
				</Label>
			</div>

			<div className="flex justify-end gap-4 pt-6 text-slate-300">
				<Button
					variant="ghost"
					type="button"
					onClick={onCancel}
					className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12 px-6"
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					disabled={isLoading}
					className="bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] text-white font-bold px-10 rounded-xl h-12 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
				>
					{isLoading
						? "Salvando..."
						: project
							? "Salvar Alterações"
							: "Criar Projeto"}
				</Button>
			</div>
		</form>
	);
};

export default ProjectForm;
