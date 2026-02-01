import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Instagram,
	Sparkles,
	Send,
	Image as ImageIcon,
	Loader2,
	AlertCircle,
	CheckCircle2,
	Upload,
	Save,
	Trash2,
	FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/useAuth";
import {
	getSocialSettings,
	saveInstagramToken,
	generateInstagramCaption,
	publishToInstagram,
	uploadImage,
	SocialSettings,
} from "@/services/api";
import ImageLibrary from "@/components/admin/ImageLibrary";

declare global {
	interface Window {
		FB: any;
		fbAsyncInit: () => void;
	}
}

interface SocialDraft {
	id: string;
	idea: string;
	caption: string;
	imageUrl: string;
	createdAt: string;
}

const ManageSocial = () => {
	const { token } = useAuth();
	const [settings, setSettings] = useState<SocialSettings | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const [idea, setIdea] = useState("");
	const [caption, setCaption] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [drafts, setDrafts] = useState<SocialDraft[]>([]);

	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (token) {
			loadSettings();
			loadDrafts();
		}
	}, [token]);

	const loadSettings = async () => {
		if (!token) return;
		setIsLoading(true);
		const data = await getSocialSettings(token);
		setSettings(data);
		setIsLoading(false);

		// Initialize Facebook SDK if we have the App ID
		if (data?.appId) {
			const initFB = () => {
				if (window.FB) {
					window.FB.init({
						appId: data.appId,
						cookie: true,
						xfbml: true,
						version: "v21.0",
					});
				}
			};

			if (window.FB) {
				initFB();
			} else {
				window.fbAsyncInit = initFB;
			}
		}
	};

	const loadDrafts = () => {
		const saved = localStorage.getItem("instagram_drafts");
		if (saved) {
			try {
				setDrafts(JSON.parse(saved));
			} catch (e) {
				console.error("Error loading drafts", e);
			}
		}
	};

	const saveDraft = () => {
		if (!caption && !imageUrl && !idea) {
			toast.error("Nada para salvar como rascunho!");
			return;
		}

		const newDraft: SocialDraft = {
			id: crypto.randomUUID(),
			idea,
			caption,
			imageUrl,
			createdAt: new Date().toISOString(),
		};

		const updatedDrafts = [newDraft, ...drafts];
		setDrafts(updatedDrafts);
		localStorage.setItem("instagram_drafts", JSON.stringify(updatedDrafts));
		toast.success("Rascunho salvo!");
	};

	const loadDraftItem = (draft: SocialDraft) => {
		setIdea(draft.idea);
		setCaption(draft.caption);
		setImageUrl(draft.imageUrl);
		toast.info("Rascunho carregado");
	};

	const deleteDraft = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const updated = drafts.filter((d) => d.id !== id);
		setDrafts(updated);
		localStorage.setItem("instagram_drafts", JSON.stringify(updated));
		toast.success("Rascunho removido");
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !token) return;

		setIsUploading(true);
		try {
			const url = await uploadImage(file, token);
			if (url) {
				setImageUrl(url);
				toast.success("Imagem enviada com sucesso!");
			} else {
				toast.error("Falha ao enviar imagem.");
			}
		} catch (error) {
			toast.error("Erro no processamento da imagem.");
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	const handleFacebookLogin = () => {
		if (!settings?.appId) {
			toast.error(
				"ID do Aplicativo não configurado no servidor (Railway).",
			);
			return;
		}

		if (!window.FB) {
			toast.error(
				"Facebook SDK ainda não carregou. Tente novamente em instantes.",
			);
			return;
		}

		window.FB.login(
			(response: any) => {
				if (response.authResponse) {
					const fbToken = response.authResponse.accessToken;
					handleSaveToken(fbToken);
				} else {
					toast.error("Login cancelado ou não autorizado.");
				}
			},
			{
				scope: "instagram_basic,instagram_content_publish,pages_read_engagement,pages_show_list,business_management",
			},
		);
	};

	const handleSaveToken = async (fbToken: string) => {
		if (!token) return;
		setIsLoading(true);
		const success = await saveInstagramToken(fbToken, token);
		if (success) {
			toast.success("Conta vinculada com sucesso!");
			loadSettings();
		} else {
			toast.error("Erro ao vincular conta.");
		}
		setIsLoading(false);
	};

	const handleGenerateCaption = async () => {
		if (!idea) {
			toast.error("Digite uma ideia primeiro!");
			return;
		}
		if (!token) return;

		setIsGenerating(true);
		try {
			const result = await generateInstagramCaption(idea, token);
			if (result) {
				setCaption(result);
				toast.success("Legenda gerada!");
			}
		} catch (error) {
			toast.error("Erro ao gerar legenda.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handlePublish = async () => {
		if (!imageUrl || !caption) {
			toast.error("Imagem e legenda são obrigatórias!");
			return;
		}
		if (!token) return;

		setIsPublishing(true);
		try {
			const success = await publishToInstagram(imageUrl, caption, token);
			if (success) {
				toast.success("Post publicado no Instagram!");
				setIdea("");
				setCaption("");
				setImageUrl("");
			} else {
				toast.error("Erro ao publicar. Verifique se o token é válido.");
			}
		} catch (error) {
			toast.error("Erro técnico ao publicar.");
		} finally {
			setIsPublishing(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] gap-4">
				<Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
				<p className="text-slate-400">
					Carregando configurações sociais...
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-500 pb-20">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-4xl font-bold tracking-tight gradient-text mb-2">
						Redes Sociais
					</h1>
					<p className="text-slate-400">
						Crie e publique posts no Instagram com o auxílio da
						Inteligência Artificial.
					</p>
				</div>

				{!settings?.hasToken ? (
					<Button
						onClick={handleFacebookLogin}
						className="bg-[#1877F2] hover:bg-[#166fe5] text-white gap-2 h-12 px-6 rounded-xl font-bold"
					>
						<Instagram size={20} />
						Conectar Instagram
					</Button>
				) : (
					<div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400">
						<CheckCircle2 size={18} />
						<span className="text-sm font-bold">
							Instagram Conectado
						</span>
					</div>
				)}
			</div>

			{!settings?.hasToken && (
				<Card className="bg-[#14181F] border-white/5 border-dashed">
					<CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
						<div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6">
							<AlertCircle className="text-slate-500" size={32} />
						</div>
						<h3 className="text-xl font-bold mb-2">
							Conecte sua conta profissional
						</h3>
						<p className="text-slate-400 max-w-md mb-6">
							Para postar diretamente por aqui, você precisa
							vincular sua conta do Instagram Business que está
							ligada a uma página do Facebook.
						</p>
						<Button
							variant="outline"
							onClick={handleFacebookLogin}
							className="border-white/10 text-white"
						>
							Começar agora
						</Button>
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Editor Section */}
				<div className="space-y-6">
					<Card className="bg-[#14181F] border-white/5 overflow-hidden">
						<CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
							<CardTitle className="text-lg flex items-center gap-2">
								<Sparkles
									className="text-purple-400"
									size={20}
								/>
								Criar Novo Post
							</CardTitle>
							<Button
								variant="ghost"
								size="sm"
								onClick={saveDraft}
								className="text-slate-400 hover:text-white gap-2"
							>
								<Save size={16} />
								Salvar Rascunho
							</Button>
						</CardHeader>
						<CardContent className="p-6 space-y-6">
							<div className="space-y-2">
								<Label
									htmlFor="idea"
									className="text-slate-400"
								>
									Sobre o que é o post?
								</Label>
								<div className="flex gap-2">
									<Input
										id="idea"
										placeholder="Ex: Novo site lançado para uma clínica médica..."
										value={idea}
										onChange={(e) =>
											setIdea(e.target.value)
										}
										className="bg-[#0B0E14] border-white/5 focus:ring-purple-500 rounded-xl h-12"
									/>
									<Button
										onClick={handleGenerateCaption}
										disabled={isGenerating || !idea}
										className="bg-purple-600 hover:bg-purple-700 h-12 rounded-xl px-4"
									>
										{isGenerating ? (
											<Loader2
												size={18}
												className="animate-spin"
											/>
										) : (
											<Sparkles size={18} />
										)}
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="caption"
									className="text-slate-400"
								>
									Legenda (Preview/Edit)
								</Label>
								<Textarea
									id="caption"
									placeholder="A legenda gerada aparecerá aqui..."
									value={caption}
									onChange={(e) => setCaption(e.target.value)}
									className="bg-[#0B0E14] border-white/5 focus:ring-cyan-500 rounded-xl min-h-[200px] p-4 font-inter text-base"
								/>
							</div>

							<div className="space-y-4">
								<Label className="text-slate-400">
									Imagem do Post
								</Label>
								<div className="flex flex-col gap-3">
									<div className="flex gap-2">
										<div className="relative flex-grow">
											<Input
												placeholder="URL da imagem..."
												value={imageUrl}
												onChange={(e) =>
													setImageUrl(e.target.value)
												}
												className="bg-[#0B0E14] border-white/5 rounded-xl h-12"
											/>
										</div>
										<Button
											variant="outline"
											onClick={handleUploadClick}
											disabled={isUploading}
											className="border-white/10 hover:bg-white/5 h-12 rounded-xl gap-2"
										>
											{isUploading ? (
												<Loader2
													size={18}
													className="animate-spin"
												/>
											) : (
												<Upload size={18} />
											)}
											Upload
										</Button>
										<input
											type="file"
											ref={fileInputRef}
											onChange={handleFileChange}
											className="hidden"
											accept="image/*"
										/>
									</div>
									<div className="flex justify-start">
										<ImageLibrary
											onSelect={(url) => setImageUrl(url)}
										/>
									</div>
								</div>
							</div>

							<Button
								onClick={handlePublish}
								disabled={
									isPublishing ||
									!imageUrl ||
									!caption ||
									!settings?.hasToken
								}
								className="w-full h-14 bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] gap-2 text-lg"
							>
								{isPublishing ? (
									<Loader2
										className="animate-spin"
										size={24}
									/>
								) : (
									<>
										<Send size={20} />
										Publicar no Instagram
									</>
								)}
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Preview Section & Drafts List */}
				<div className="space-y-6">
					<Card className="bg-[#14181F] border-white/5 overflow-hidden">
						<CardHeader className="border-b border-white/5">
							<CardTitle className="text-lg flex items-center gap-2">
								<Instagram
									className="text-pink-500"
									size={20}
								/>
								Preview Instagram
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="max-w-[400px] mx-auto bg-black border border-white/5 overflow-hidden shadow-2xl my-4">
								{/* Header */}
								<div className="p-3 flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
										<div className="w-full h-full rounded-full bg-black flex items-center justify-center p-[1px]">
											<div className="w-full h-full rounded-full bg-slate-800" />
										</div>
									</div>
									<span className="text-sm font-bold text-white tracking-tight">
										meusiteperfeito
									</span>
								</div>

								{/* Image */}
								<div className="aspect-square bg-slate-900 flex items-center justify-center overflow-hidden">
									{imageUrl ? (
										<img
											src={imageUrl}
											alt="Preview"
											className="w-full h-full object-cover"
										/>
									) : (
										<ImageIcon
											size={48}
											className="text-slate-800"
										/>
									)}
								</div>

								{/* Actions */}
								<div className="p-3 text-white">
									<div className="flex gap-4 mb-3">
										<div className="w-6 h-6 border-2 border-white rounded-full opacity-50" />
										<div className="w-6 h-6 border-2 border-white rounded-full opacity-50" />
										<div className="w-6 h-6 border-2 border-white rounded-full opacity-50" />
									</div>
									<div className="space-y-1">
										<p className="text-xs font-bold">
											128 curtidas
										</p>
										<div className="text-sm">
											<span className="font-bold mr-2 text-white">
												meusiteperfeito
											</span>
											<span className="whitespace-pre-line text-slate-200">
												{caption ||
													"Sua legenda aparecerá aqui..."}
											</span>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Drafts List */}
					{drafts.length > 0 && (
						<Card className="bg-[#14181F] border-white/5 overflow-hidden">
							<CardHeader className="border-b border-white/5 font-bold">
								<CardTitle className="text-lg flex items-center gap-2">
									<FileText
										className="text-cyan-400"
										size={20}
									/>
									Rascunhos Salvos
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4">
								<div className="grid grid-cols-2 gap-4">
									{drafts.slice(0, 4).map((draft) => (
										<div
											key={draft.id}
											onClick={() => loadDraftItem(draft)}
											className="group relative aspect-square bg-slate-900 rounded-lg overflow-hidden border border-white/5 cursor-pointer hover:border-cyan-400/50 transition-all"
										>
											{draft.imageUrl ? (
												<img
													src={draft.imageUrl}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-slate-600">
													Sem imagem
												</div>
											)}
											<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-4 transition-opacity">
												<p className="text-xs text-white text-center line-clamp-2 mb-2 font-medium">
													{draft.idea || "Sem ideia"}
												</p>
												<Button
													variant="destructive"
													size="icon"
													className="h-8 w-8 rounded-full"
													onClick={(e) =>
														deleteDraft(draft.id, e)
													}
												>
													<Trash2 size={14} />
												</Button>
											</div>
										</div>
									))}
								</div>
								{drafts.length > 4 && (
									<p className="text-center text-xs text-slate-500 mt-4">
										Exibindo os 4 rascunhos mais recentes
									</p>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManageSocial;
