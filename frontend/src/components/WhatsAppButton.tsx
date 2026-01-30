import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useState } from "react";

const WhatsAppIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		className={className}
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
	</svg>
);

const WhatsAppButton = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [userMessage, setUserMessage] = useState("");

	const phoneNumber = "5511995019783";

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!userMessage.trim()) return;

		const message = encodeURIComponent(userMessage);
		const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
		window.open(whatsappUrl, "_blank");
		setUserMessage("");
		setIsOpen(false);
	};

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{
							opacity: 0,
							y: 20,
							scale: 0.95,
							originX: 1,
							originY: 1,
						}}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						className="mb-4 w-80 sm:w-96 bg-[#14181F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden font-outfit"
					>
						{/* Header */}
						<div className="bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] p-4 text-white">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
										<img
											src="/images/daniela.jpg"
											alt="Daniela Ghidini"
											className="w-full h-full object-cover"
										/>
									</div>
									<div>
										<p className="font-bold text-sm">
											Daniela Ghidini
										</p>
										<div className="flex items-center gap-1.5">
											<span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
											<span className="text-[10px] opacity-90">
												Online agora
											</span>
										</div>
									</div>
								</div>
								<button
									onClick={() => setIsOpen(false)}
									className="hover:bg-white/10 p-1 rounded-full transition-colors"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
						</div>

						{/* Body */}
						<div className="p-6 bg-[#0B0E14] space-y-4">
							<div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 max-w-[85%]">
								<p className="text-sm text-slate-300">
									Olá! Como posso ajudar você hoje? 👋
								</p>
							</div>

							<form
								onSubmit={handleSendMessage}
								className="space-y-3 pt-2"
							>
								<div className="relative">
									<textarea
										autoFocus
										value={userMessage}
										onChange={(e) =>
											setUserMessage(e.target.value)
										}
										placeholder="Digite sua mensagem..."
										className="w-full bg-[#14181F] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent outline-none resize-none transition-all h-24"
										onKeyDown={(e) => {
											if (
												e.key === "Enter" &&
												!e.shiftKey
											) {
												e.preventDefault();
												handleSendMessage(e);
											}
										}}
									/>
								</div>
								<button
									type="submit"
									disabled={!userMessage.trim()}
									className="w-full bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] hover:opacity-90 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00E5FF]/20"
								>
									<Send className="w-4 h-4" />
									Enviar no WhatsApp
								</button>
							</form>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Floating Button */}
			<motion.div
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 1, duration: 0.5 }}
			>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="relative group flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-300 active:scale-90"
				>
					{/* Pulse Animation (hidden when open) */}
					{!isOpen && (
						<span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
					)}

					{isOpen ? (
						<X className="w-8 h-8" />
					) : (
						<WhatsAppIcon className="w-8 h-8" />
					)}

					{/* Tooltip (only when closed) */}
					{!isOpen && (
						<span className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 shadow-xl">
							Fale por WhatsApp!
						</span>
					)}
				</button>
			</motion.div>
		</div>
	);
};

export default WhatsAppButton;
