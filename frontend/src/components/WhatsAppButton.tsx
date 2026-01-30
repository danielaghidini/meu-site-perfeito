import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
	const phoneNumber = "5511995019783";
	const message = encodeURIComponent(
		"Olá! Vi seu site e gostaria de solicitar um orçamento.",
	);
	const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

	return (
		<motion.div
			initial={{ scale: 0, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ delay: 1, duration: 0.5 }}
			className="fixed bottom-6 right-6 z-50"
		>
			<a
				href={whatsappUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="relative group flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-300"
			>
				{/* Pulse Animation */}
				<span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0 transition-opacity" />

				<MessageCircle className="w-8 h-8 fill-current" />

				{/* Tooltip */}
				<span className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 shadow-xl">
					Clique para falar no WhatsApp
				</span>
			</a>
		</motion.div>
	);
};

export default WhatsAppButton;
