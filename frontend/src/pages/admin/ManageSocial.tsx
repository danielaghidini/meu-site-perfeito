import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/useAuth";
import {
	getSocialSettings,
	saveInstagramToken,
	generateInstagramCaption,
	publishToInstagram,
	SocialSettings,
} from "@/services/api";
import ImageLibrary from "@/components/admin/ImageLibrary";

declare global {
	interface Window {
		FB: any;
		fbAsyncInit: () => void;
	}
}

const ManageSocial = () => {
	const { token } = useAuth();
	const [settings, setSettings] = useState<SocialSettings | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);

	const [idea, setIdea] = useState("");
	const [caption, setCaption] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		if (token) {
			loadSettings();
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
					console.log("Facebook SDK Inicializado com sucesso!");
				}
			};

			if (window.FB) {
				initFB();
			} else {
				window.fbAsyncInit = initFB;
			}
		}
	};

	const handleFacebookLogin = () => {
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
		<div className="space-y-8 animate-in fade-in duration-500">
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
						<CardHeader className="border-b border-white/5">
							<CardTitle className="text-lg flex items-center gap-2">
								<Sparkles
									className="text-purple-400"
									size={20}
								/>
								Criar Novo Post
							</CardTitle>
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
								<div className="flex gap-2">
									<div className="relative flex-grow">
										<Input
											placeholder="URL da imagem (escolha na biblioteca)"
											value={imageUrl}
											onChange={(e) =>
												setImageUrl(e.target.value)
											}
											className="bg-[#0B0E14] border-white/5 rounded-xl h-12"
										/>
									</div>
									<ImageLibrary
										onSelect={(url) => setImageUrl(url)}
									/>
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

				{/* Preview Section */}
				<div className="space-y-6">
					<Card className="bg-[#14181F] border-white/5 overflow-hidden sticky top-24">
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
							<div className="max-w-[400px] mx-auto bg-black border border-white/5 overflow-hidden shadow-2xl">
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
										<div className="w-6 h-6 border-2 border-white rounded-full" />
										<div className="w-6 h-6 border-2 border-white rounded-full" />
										<div className="w-6 h-6 border-2 border-white rounded-full" />
									</div>
									<div className="space-y-1">
										<p className="text-xs font-bold">
											128 curtidas
										</p>
										<div className="text-sm">
											<span className="font-bold mr-2">
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
				</div>
			</div>
		</div>
	);
};

export default ManageSocial;
