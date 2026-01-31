import React, { useState, useEffect } from "react";
import { getMedia, Media } from "@/services/api";
import { useAuth } from "@/contexts/useAuth";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ImageLibraryProps {
	onSelect: (url: string) => void;
	trigger?: React.ReactNode;
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({ onSelect, trigger }) => {
	const [images, setImages] = useState<Media[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const { token } = useAuth();

	const loadImages = async () => {
		if (!token) return;
		setIsLoading(true);
		try {
			const data = await getMedia(token);
			setImages(data);
		} catch (error) {
			console.error("Error loading library:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			loadImages();
		}
	}, [isOpen]);

	const filteredImages = images.filter((img) =>
		img.url.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button
						variant="outline"
						className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl px-4 h-12 text-slate-300"
					>
						<Search size={14} />
						Biblioteca
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-4xl bg-[#14181F] border-white/5 text-white max-h-[80vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold font-sora">
						Biblioteca de Mídia
					</DialogTitle>
				</DialogHeader>

				<div className="relative my-4">
					<Input
						placeholder="Buscar imagens..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-[#0B0E14] border-white/5 pl-10 h-10 rounded-xl"
					/>
					<Search
						size={16}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
					/>
				</div>

				<div className="flex-1 overflow-y-auto min-h-[300px] p-2">
					{isLoading ? (
						<div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
							<Loader2
								size={40}
								className="animate-spin text-primary"
							/>
							<p>Carregando sua biblioteca...</p>
						</div>
					) : filteredImages.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500 py-20">
							<ImageIcon size={48} className="opacity-20" />
							<p>
								{searchTerm
									? "Nenhuma imagem encontrada."
									: "Sua biblioteca está vazia."}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{filteredImages.map((img) => (
								<button
									key={img.id}
									onClick={() => {
										onSelect(img.url);
										setIsOpen(false);
									}}
									className="group relative aspect-square rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all bg-[#0B0E14]"
								>
									<img
										src={img.url}
										alt="Media"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
											Selecionar
										</span>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ImageLibrary;
