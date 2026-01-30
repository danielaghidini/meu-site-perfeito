import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const AdminLogin = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/auth/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				},
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Falha ao entrar");
			}

			login(data.token, data.user);
			toast.success("Bem-vindo ao seu painel!");
			navigate("/painel");
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0B0E14] p-4 font-outfit">
			<Card className="w-full max-w-md shadow-2xl border border-white/5 bg-[#14181F] backdrop-blur-xl rounded-3xl overflow-hidden">
				<div className="h-1.5 bg-gradient-to-r from-[#00E5FF] via-[#7B61FF] to-[#FF00E5]" />
				<CardHeader className="space-y-4 text-center pt-12">
					<div className="flex justify-center mb-2">
						<img
							src={logo}
							alt="Meu Site Perfeito"
							className="h-20 md:h-24"
						/>
					</div>
					<CardDescription className="text-slate-400 font-medium tracking-wide uppercase text-xs">
						Painel Administrativo
					</CardDescription>
				</CardHeader>
				<CardContent className="pb-12 px-10">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-semibold text-slate-300 ml-1">
								E-mail
							</label>
							<Input
								type="email"
								placeholder="exemplo@site.com.br"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="bg-[#0B0E14] border-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#00E5FF] h-12 rounded-xl"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-semibold text-slate-300 ml-1">
								Senha
							</label>
							<Input
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="bg-[#0B0E14] border-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#00E5FF] h-12 rounded-xl"
							/>
						</div>
						<Button
							type="submit"
							className="w-full h-12 bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] hover:opacity-90 text-[#0B0E14] font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all"
							disabled={isLoading}
						>
							{isLoading ? "Entrando..." : "Entrar no Painel"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default AdminLogin;
