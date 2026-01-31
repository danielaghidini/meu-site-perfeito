import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	createPost,
	updatePost,
	uploadImage,
	generateAIContent,
	getCategories,
	Post,
	Category,
} from "@/services/api";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "sonner";
import {
	Upload,
	ImageIcon,
	Loader2,
	Sparkles,
	Bold,
	Italic,
	Heading2,
	Heading3,
	Link,
	Type,
} from "lucide-react";
import ImageLibrary from "./ImageLibrary";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ArticleFormProps {
	article?: Post;
	onSuccess: () => void;
	onCancel: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
	article,
	onSuccess,
	onCancel,
}) => {
	const { token } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [tab, setTab] = useState<"write" | "preview">("write");
	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		excerpt: "",
		content: "",
		coverUrl: "",
		categoryId: "",
		published: false,
	});
	const [aiPrompt, setAiPrompt] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [showAiInput, setShowAiInput] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const contentRef = useRef<HTMLTextAreaElement>(null);

	const insertImage = (url: string) => {
		const textarea = contentRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = textarea.value;
		const before = text.substring(0, start);
		const after = text.substring(end, text.length);
		const imageTag = `\n<img src="${url}" alt="Descrição da imagem" style="width: 100%; border-radius: 12px; margin: 20px 0;" />\n`;

		setFormData((prev) => ({
			...prev,
			content: before + imageTag + after,
		}));

		// Recuperar foco e colocar cursor após a imagem
		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(
				start + imageTag.length,
				start + imageTag.length,
			);
		}, 10);
	};

	const insertFormatting = (
		tag: string,
		endTag?: string,
		style?: string,
		classNames?: string,
	) => {
		const textarea = contentRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = textarea.value;
		const selectedText = text.substring(start, end);

		const openTag = style
			? `<${tag} style="${style}">`
			: classNames
				? `<${tag} class="${classNames}">`
				: `<${tag}>`;
		const closeTag = endTag || `</${tag}>`;

		const formatted = `${openTag}${selectedText || "texto"}${closeTag}`;
		const before = text.substring(0, start);
		const after = text.substring(end, text.length);

		setFormData((prev) => ({
			...prev,
			content: before + formatted + after,
		}));

		setTimeout(() => {
			textarea.focus();
			if (selectedText) {
				textarea.setSelectionRange(start, start + formatted.length);
			} else {
				textarea.setSelectionRange(
					start + openTag.length,
					start + openTag.length + 5,
				);
			}
		}, 10);
	};

	useEffect(() => {
		const loadCategories = async () => {
			const data = await getCategories();
			setCategories(data);
		};
		loadCategories();
	}, []);

	useEffect(() => {
		if (article) {
			let cid = article.categoryId || "";

			// Fallback: se não temos o ID mas temos o nome (tags), tentamos achar o ID na lista
			if (!cid && article.tags && categories.length > 0) {
				const found = categories.find((c) => c.name === article.tags);
				if (found) cid = found.id;
			}

			setFormData({
				title: article.title || "",
				slug: article.slug || "",
				excerpt: article.excerpt || "",
				content: article.content || "",
				coverUrl: article.coverUrl || "",
				categoryId: cid,
				published: article.published ?? true,
			});
		}
	}, [article, categories]);

	const generateSlug = (text: string) => {
		return text
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/ /g, "-")
			.replace(/[^\w-]+/g, "");
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => {
			const newData = { ...prev, [name]: value };
			// Auto-generate slug from title
			if (name === "title") {
				const currentAutoSlug = generateSlug(prev.title);
				if (!prev.slug || prev.slug === currentAutoSlug) {
					newData.slug = generateSlug(value);
				}
			}
			return newData;
		});
	};

	const handleCheckboxChange = (name: string, checked: boolean) => {
		setFormData((prev) => ({ ...prev, [name]: checked }));
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !token) return;

		setIsUploading(true);
		try {
			const url = await uploadImage(file, token);
			if (url) {
				setFormData((prev) => ({ ...prev, coverUrl: url }));
				toast.success("Imagem carregada com sucesso!");
			} else {
				toast.error("Erro ao carregar imagem.");
			}
		} catch (error) {
			toast.error("Erro no upload.");
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!token) return;

		setIsLoading(true);
		try {
			// Map 'tags' to 'categoryId' or similar if backend requires it.
			// For now, our Article table has categoryId.
			// We might need to fetch categories or just send it as is for now.
			const submissionData = {
				...formData,
				categoryId: formData.categoryId || null,
			};

			if (article) {
				const result = await updatePost(
					article.id,
					submissionData,
					token,
				);
				if (result) {
					toast.success("Artigo atualizado com sucesso!");
					onSuccess();
				} else {
					throw new Error("Falha ao atualizar artigo");
				}
			} else {
				const result = await createPost(submissionData, token);
				if (result) {
					toast.success("Artigo criado com sucesso!");
					onSuccess();
				} else {
					throw new Error("Falha ao criar artigo");
				}
			}
		} catch (error) {
			toast.error("Erro ao salvar o artigo. Verifique os dados.");
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
						Título do Artigo
					</Label>
					<Input
						id="title"
						name="title"
						value={formData.title}
						onChange={handleChange}
						placeholder="Ex: Dez dicas imperdíveis sobre..."
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
						placeholder="dez-dicas-imperdiveis-sobre-"
						required
						className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="excerpt" className="text-slate-400">
					Resumo (Excerpt)
				</Label>
				<Input
					id="excerpt"
					name="excerpt"
					value={formData.excerpt}
					onChange={handleChange}
					placeholder="Uma breve introdução que aparece na listagem..."
					className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12"
				/>
			</div>

			<div className="space-y-4">
				<Label htmlFor="coverUrl" className="text-slate-400">
					Imagem de Capa
				</Label>
				<div className="flex flex-col gap-4">
					{formData.coverUrl && (
						<div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 group max-h-48">
							<img
								src={formData.coverUrl}
								alt="Preview"
								className="w-full h-full object-cover"
							/>
						</div>
					)}
					<div className="flex gap-2">
						<div className="relative flex-grow">
							<Input
								id="coverUrl"
								name="coverUrl"
								value={formData.coverUrl}
								onChange={handleChange}
								placeholder="Link da imagem ou upload"
								className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12 pr-12"
							/>
							<div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
								<ImageIcon className="w-5 h-5" />
							</div>
						</div>
						<div className="relative">
							<input
								type="file"
								id="file-upload"
								className="hidden"
								accept="image/*"
								onChange={handleFileChange}
								disabled={isUploading}
							/>
							<Button
								type="button"
								asChild
								variant="outline"
								className="h-12 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl px-4 cursor-pointer"
								disabled={isUploading}
							>
								<label
									htmlFor="file-upload"
									className="flex items-center gap-2"
								>
									{isUploading ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<Upload className="w-5 h-5" />
									)}
									{isUploading ? "..." : "Upload"}
								</label>
							</Button>
						</div>
						<ImageLibrary
							onSelect={(url) =>
								setFormData((p) => ({ ...p, coverUrl: url }))
							}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label htmlFor="content" className="text-slate-400">
						Conteúdo
					</Label>
					<div className="flex flex-wrap items-center gap-2 mb-2 p-2 bg-[#0B0E14] border border-white/5 rounded-xl">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => insertFormatting("strong")}
							className="h-8 w-8 p-0 text-slate-400 hover:text-white"
							title="Negrito"
						>
							<Bold size={16} />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => insertFormatting("em")}
							className="h-8 w-8 p-0 text-slate-400 hover:text-white"
							title="Itálico"
						>
							<Italic size={16} />
						</Button>
						<div className="w-[1px] h-4 bg-white/10 mx-1" />
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => insertFormatting("h2")}
							className="h-8 w-8 p-0 text-slate-400 hover:text-white"
							title="Título 2"
						>
							<Heading2 size={16} />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => insertFormatting("h3")}
							className="h-8 w-8 p-0 text-slate-400 hover:text-white"
							title="Título 3"
						>
							<Heading3 size={16} />
						</Button>
						<div className="w-[1px] h-4 bg-white/10 mx-1" />
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() =>
								insertFormatting(
									"span",
									"</span>",
									"",
									"text-cyan",
								)
							}
							className="h-8 w-8 p-0 text-[#00E5FF] hover:bg-[#00E5FF]/10"
							title="Cor Ciano"
						>
							<Type size={16} />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() =>
								insertFormatting(
									"span",
									"</span>",
									"",
									"text-purple",
								)
							}
							className="h-8 w-8 p-0 text-[#7B61FF] hover:bg-[#7B61FF]/10"
							title="Cor Roxa"
						>
							<Type size={16} />
						</Button>
						<div className="w-[1px] h-4 bg-white/10 mx-1" />
						<ImageLibrary
							onSelect={insertImage}
							trigger={
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-8 px-2 text-slate-400 hover:text-white"
								>
									<ImageIcon size={16} className="mr-2" />
									Imagem
								</Button>
							}
						/>
						<div className="flex-grow" />
						{showAiInput ? (
							<div className="flex gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
								<Input
									placeholder="Sobre o que quer escrever?"
									value={aiPrompt}
									onChange={(e) =>
										setAiPrompt(e.target.value)
									}
									className="h-8 w-48 text-xs bg-[#0B0E14] border-white/10"
								/>
								<Button
									type="button"
									size="sm"
									disabled={isGenerating || !formData.title}
									onClick={async () => {
										if (!token) return;
										setIsGenerating(true);
										const content = await generateAIContent(
											formData.title,
											aiPrompt,
											token,
										);
										if (content) {
											setFormData((p) => ({
												...p,
												content,
											}));
											toast.success(
												"Conteúdo gerado com sucesso!",
											);
											setShowAiInput(false);
										}
										setIsGenerating(false);
									}}
									className="h-8 bg-purple-600 hover:bg-purple-700 text-white"
								>
									{isGenerating ? (
										<Loader2
											size={14}
											className="animate-spin"
										/>
									) : (
										"Gerar"
									)}
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => setShowAiInput(false)}
									className="h-8 text-slate-500"
								>
									X
								</Button>
							</div>
						) : (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setShowAiInput(true)}
								className="h-8 border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
							>
								<Sparkles size={14} className="mr-2" />
								Escrever com IA
							</Button>
						)}

						<div className="flex bg-[#0B0E14] p-1 rounded-lg border border-white/5">
							<button
								type="button"
								onClick={() => setTab("write")}
								className={`px-3 py-1 text-xs rounded-md transition-all ${tab === "write" ? "bg-white/10 text-white font-bold" : "text-slate-500 hover:text-slate-300"}`}
							>
								Escrever
							</button>
							<button
								type="button"
								onClick={() => setTab("preview")}
								className={`px-3 py-1 text-xs rounded-md transition-all ${tab === "preview" ? "bg-white/10 text-white font-bold" : "text-slate-500 hover:text-slate-300"}`}
							>
								Visualizar
							</button>
						</div>
					</div>
				</div>

				{tab === "write" ? (
					<Textarea
						id="content"
						name="content"
						ref={contentRef}
						value={formData.content}
						onChange={handleChange}
						placeholder="Escreva seu artigo aqui..."
						className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] min-h-[400px] p-8 rounded-xl font-inter leading-relaxed text-lg"
						required
					/>
				) : (
					<div
						className="bg-[#0B0E14] border border-white/5 rounded-xl min-h-[400px] p-8 overflow-y-auto max-h-[600px] prose dark:prose-invert max-w-none 
						prose-headings:font-bold prose-headings:text-foreground
						prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
						prose-strong:text-foreground prose-strong:font-bold
						prose-li:text-muted-foreground
						prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
						prose-a:text-primary hover:prose-a:underline
						prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1 prose-code:rounded prose-code:font-mono
						prose-img:rounded-xl prose-img:shadow-lg"
						dangerouslySetInnerHTML={{
							__html:
								formData.content ||
								"<i>Nada para visualizar ainda...</i>",
						}}
					/>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label htmlFor="tags" className="text-slate-400">
						Categoria
					</Label>
					<Select
						value={formData.categoryId}
						onValueChange={(value) =>
							setFormData((prev) => ({
								...prev,
								categoryId: value,
							}))
						}
					>
						<SelectTrigger className="bg-[#0B0E14] border-white/5 focus:ring-[#00E5FF] rounded-xl h-12 text-white">
							<SelectValue placeholder="Selecione uma categoria" />
						</SelectTrigger>
						<SelectContent className="bg-[#14181F] border-white/5 text-white">
							{categories.map((cat) => (
								<SelectItem
									key={cat.id}
									value={cat.id}
									className="hover:bg-white/5 focus:bg-white/5"
								>
									{cat.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-4 justify-center">
					<Label className="text-slate-400">
						Status da Publicação
					</Label>
					<RadioGroup
						value={formData.published ? "published" : "draft"}
						onValueChange={(value) =>
							setFormData((prev) => ({
								...prev,
								published: value === "published",
							}))
						}
						className="flex gap-6"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem
								value="published"
								id="published"
								className="border-white/20 data-[state=checked]:border-[#00E5FF] data-[state=checked]:text-[#00E5FF]"
							/>
							<Label
								htmlFor="published"
								className="text-slate-300 cursor-pointer"
							>
								Publicar agora
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem
								value="draft"
								id="draft"
								className="border-white/20 data-[state=checked]:border-[#00E5FF] data-[state=checked]:text-[#00E5FF]"
							/>
							<Label
								htmlFor="draft"
								className="text-slate-300 cursor-pointer"
							>
								Rascunho
							</Label>
						</div>
					</RadioGroup>
				</div>
			</div>

			<div className="flex justify-end gap-4 pt-6">
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
						: article
							? "Salvar Artigo"
							: "Publicar Artigo"}
				</Button>
			</div>
		</form>
	);
};

export default ArticleForm;
