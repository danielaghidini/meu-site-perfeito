import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const CookieConsent = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const consent = localStorage.getItem("cookie-consent");
		if (!consent) {
			setIsVisible(true);
		}
	}, []);

	const handleAccept = () => {
		localStorage.setItem("cookie-consent", "true");
		setIsVisible(false);
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 100, opacity: 0 }}
					className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
				>
					<div className="max-w-7xl mx-auto">
						<div className="glass rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
							{/* Background glow decoration */}
							<div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

							<div className="flex items-start md:items-center gap-4 relative z-10">
								<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
									<Cookie className="w-6 h-6 text-primary" />
								</div>
								<div className="space-y-1">
									<h4 className="font-display font-bold text-white text-lg">
										Privacidade e Cookies
									</h4>
									<p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
										Utilizamos cookies para personalizar
										conteúdo e anúncios, fornecer recursos
										de redes sociais e analisar nosso
										tráfego. Ao continuar navegando, você
										concorda com a nossa{" "}
										<Link
											to="/politica-de-privacidade"
											className="text-primary hover:underline font-medium"
										>
											política de privacidade
										</Link>
										.
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3 w-full md:w-auto relative z-10">
								<Button
									variant="hero-outline"
									className="flex-1 md:flex-none h-12 px-6 rounded-xl border-white/10 text-white hover:bg-white/5"
									onClick={() => setIsVisible(false)}
								>
									Recusar
								</Button>
								<Button
									variant="hero"
									className="flex-1 md:flex-none h-12 px-8 rounded-xl"
									onClick={handleAccept}
								>
									Aceitar Tudo
								</Button>
							</div>

							{/* Close Button Mobile */}
							<button
								onClick={() => setIsVisible(false)}
								className="absolute top-4 right-4 text-slate-500 hover:text-white md:hidden"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default CookieConsent;
