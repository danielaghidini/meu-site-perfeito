import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MapPin, Send, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendContact } from "@/services/api";

const ContactSection = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			company: formData.get("company") as string,
			project: formData.get("project") as string,
			message: formData.get("message") as string,
		};

		try {
			await sendContact(data);
			toast({
				title: "Mensagem enviada!",
				description: "Entraremos em contato em até 24 horas.",
			});
			(e.target as HTMLFormElement).reset();
		} catch (error) {
			toast({
				title: "Erro ao enviar",
				description:
					"Ocorreu um problema, tente novamente em instantes.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section id="contato" className="py-20 md:py-24 relative" ref={ref}>
			{/* Background decoration */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-6 relative z-10">
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={isInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<span className="text-primary font-medium text-sm tracking-wider uppercase">
							Contato
						</span>
						<h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
							Vamos criar seu{" "}
							<span className="text-gradient">
								site perfeito?
							</span>
						</h2>
						<p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
							Entre em contato para solicitar um orçamento
							gratuito. Respondemos em até 24 horas!
						</p>
					</motion.div>

					<div className="grid lg:grid-cols-2 gap-16">
						{/* Contact Info */}
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={isInView ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="space-y-8"
						>
							<div className="space-y-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
										<Mail className="w-5 h-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Email
										</p>
										<a
											href="mailto:contato@meusiteperfeito.com.br"
											className="font-medium hover:text-primary transition-colors"
										>
											contato@meusiteperfeito.com.br
										</a>
									</div>
								</div>

								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
										<Phone className="w-5 h-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											WhatsApp
										</p>
										<a
											href="https://wa.me/5511999999999"
											className="font-medium hover:text-primary transition-colors"
										>
											(11) 99999-9999
										</a>
									</div>
								</div>

								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
										<MapPin className="w-5 h-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Localização
										</p>
										<p className="font-medium">
											São Paulo, Brasil
										</p>
									</div>
								</div>

								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
										<Clock className="w-5 h-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Horário
										</p>
										<p className="font-medium">
											Seg - Sex, 9h às 18h
										</p>
									</div>
								</div>
							</div>

							<div className="p-6 bg-gradient-card rounded-xl border border-border/50">
								<h4 className="font-display font-semibold mb-2">
									Orçamento Gratuito
								</h4>
								<p className="text-muted-foreground text-sm">
									Preencha o formulário e receba uma proposta
									personalizada para o seu projeto sem
									compromisso.
								</p>
							</div>
						</motion.div>

						{/* Contact Form */}
						<motion.form
							initial={{ opacity: 0, x: 50 }}
							animate={isInView ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.6, delay: 0.4 }}
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							<div className="grid sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<label
										htmlFor="name"
										className="text-sm font-medium"
									>
										Nome
									</label>
									<Input
										id="name"
										name="name"
										placeholder="Seu nome"
										required
										className="bg-secondary/30 border-border/50 focus:border-primary"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="email"
										className="text-sm font-medium"
									>
										Email
									</label>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="seu@email.com"
										required
										className="bg-secondary/30 border-border/50 focus:border-primary"
									/>
								</div>
							</div>

							<div className="grid sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<label
										htmlFor="phone"
										className="text-sm font-medium"
									>
										Telefone
									</label>
									<Input
										id="phone"
										name="phone"
										placeholder="(11) 99999-9999"
										className="bg-secondary/30 border-border/50 focus:border-primary"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="company"
										className="text-sm font-medium"
									>
										Empresa
									</label>
									<Input
										id="company"
										name="company"
										placeholder="Nome da empresa"
										className="bg-secondary/30 border-border/50 focus:border-primary"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="project"
									className="text-sm font-medium"
								>
									Tipo de Projeto
								</label>
								<Input
									id="project"
									name="project"
									placeholder="Ex: Site institucional, E-commerce, Blog..."
									required
									className="bg-secondary/30 border-border/50 focus:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="message"
									className="text-sm font-medium"
								>
									Mensagem
								</label>
								<Textarea
									id="message"
									name="message"
									placeholder="Conte mais sobre seu projeto..."
									rows={4}
									required
									className="bg-secondary/30 border-border/50 focus:border-primary resize-none"
								/>
							</div>

							<Button
								type="submit"
								variant="hero"
								size="lg"
								className="w-full"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									"Enviando..."
								) : (
									<>
										<Send className="w-4 h-4" />
										Solicitar Orçamento
									</>
								)}
							</Button>
						</motion.form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
