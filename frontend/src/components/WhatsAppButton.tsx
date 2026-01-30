import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User } from "lucide-react";
import { useState } from "react";

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
						<div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4 text-white">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<User className="w-6 h-6" />
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
										className="w-full bg-[#14181F] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#25D366] focus:border-transparent outline-none resize-none transition-all h-24"
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
									className="w-full bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 disabled:hover:bg-[#25D366] text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20"
								>
									<Send className="w-4 h-4" />
									Iniciar Conversa
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
						<MessageCircle className="w-8 h-8 fill-current" />
					)}

					{/* Tooltip (only when closed) */}
					{!isOpen && (
						<span className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 shadow-xl">
							Fale comigo!
						</span>
					)}
				</button>
			</motion.div>
		</div>
	);
};

export default WhatsAppButton;
