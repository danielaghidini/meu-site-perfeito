import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Header />
			<main className="pt-32 pb-20 px-6">
				<div className="container mx-auto max-w-4xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="font-display text-4xl md:text-5xl font-bold mb-8 text-gradient">
							Política de Privacidade
						</h1>

						<div className="prose prose-invert prose-lg max-w-none space-y-8 text-muted-foreground leading-relaxed">
							<section className="space-y-4">
								<h2 className="text-2xl font-bold text-white">
									1. Introdução
								</h2>
								<p>
									A <strong>Meu Site Perfeito</strong> preza
									pela transparência e privacidade dos seus
									dados. Esta política descreve como coletamos
									e tratamos informações ao utilizar nosso
									site.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-bold text-white">
									2. Coleta de Dados
								</h2>
								<p>Nosso site coleta dados de duas formas:</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<strong>Formulários de Contato:</strong>{" "}
										Coletamos nome, e-mail, telefone e
										informações sobre o seu projeto para
										responder às suas solicitações de
										orçamento.
									</li>
									<li>
										<strong>Cookies:</strong> Utilizamos
										cookies técnicos para melhorar sua
										experiência de navegação e entender como
										você utiliza nosso site.
									</li>
								</ul>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-bold text-white">
									3. Uso das Informações
								</h2>
								<p>
									As informações coletadas são utilizadas
									exclusivamente para:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										Prestar o atendimento solicitado pelo
										usuário.
									</li>
									<li>
										Melhorar a performance e usabilidade do
										site.
									</li>
									<li>
										Envio de comunicações administrativas e
										comerciais (quando autorizado).
									</li>
								</ul>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-bold text-white">
									4. Cookies
								</h2>
								<p>
									Cookies são pequenos arquivos de texto
									enviados pelo site ao seu navegador. Você
									pode optar por recusar cookies através do
									nosso banner de consentimento ou nas
									configurações do seu navegador, embora isso
									possa afetar algumas funcionalidades do
									site.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-bold text-white">
									5. Seus Direitos
								</h2>
								<p>
									Em conformidade com a LGPD, você tem o
									direito de acessar, corrigir ou solicitar a
									exclusão dos seus dados pessoais a qualquer
									momento através do nosso e-mail de contato:{" "}
									<strong>
										contato@meusiteperfeito.com.br
									</strong>
									.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-bold text-white">
									6. Alterações
								</h2>
								<p>
									Esta política pode ser atualizada
									periodicamente. Recomendamos a consulta
									regular desta página para estar ciente de
									qualquer alteração.
								</p>
							</section>

							<p className="pt-10 text-sm italic">
								Última atualização: 30 de Janeiro de 2026.
							</p>
						</div>
					</motion.div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default PrivacyPolicy;
