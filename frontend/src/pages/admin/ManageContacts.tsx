import React, { useEffect, useState } from "react";
import {
	getContacts,
	Contact,
	updateContactStatus,
	apiDeleteContact,
} from "@/services/api";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "sonner";
import {
	Mail,
	Phone,
	Building2,
	Calendar,
	Trash2,
	Eye,
	CheckCircle2,
	Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const ManageContacts = () => {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedContact, setSelectedContact] = useState<Contact | null>(
		null,
	);
	const { token } = useAuth();

	const fetchContacts = async () => {
		if (!token) return;
		try {
			const data = await getContacts(token);
			setContacts(data);
		} catch (error) {
			toast.error("Erro ao carregar mensagens");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchContacts();
	}, [token]);

	const handleStatusChange = async (
		id: string,
		newStatus: Contact["status"],
	) => {
		if (!token) return;
		try {
			await updateContactStatus(id, newStatus, token);
			toast.success("Status atualizado");
			fetchContacts();
			if (selectedContact?.id === id) {
				setSelectedContact((prev) =>
					prev ? { ...prev, status: newStatus } : null,
				);
			}
		} catch (error) {
			toast.error("Erro ao atualizar status");
		}
	};

	const handleDelete = async (id: string) => {
		if (
			!token ||
			!window.confirm("Tem certeza que deseja excluir esta mensagem?")
		)
			return;
		try {
			await apiDeleteContact(id, token);
			toast.success("Mensagem excluída");
			fetchContacts();
			setSelectedContact(null);
		} catch (error) {
			toast.error("Erro ao excluir mensagem");
		}
	};

	const getStatusBadge = (status: Contact["status"]) => {
		switch (status) {
			case "NEW":
				return (
					<Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
						Nova
					</Badge>
				);
			case "READ":
				return (
					<Badge
						variant="outline"
						className="text-slate-400 border-slate-700"
					>
						Lida
					</Badge>
				);
			case "ARCHIVED":
				return (
					<Badge
						variant="outline"
						className="text-purple-400 border-purple-500/30"
					>
						Arquivada
					</Badge>
				);
		}
	};

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-white mb-2">
						Mensagens de Contato
					</h1>
					<p className="text-slate-400">
						Gerencie os pedidos de orçamento recebidos pelo site.
					</p>
				</div>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3].map((n) => (
						<div
							key={n}
							className="h-48 bg-slate-800/50 animate-pulse rounded-xl"
						/>
					))}
				</div>
			) : contacts.length === 0 ? (
				<div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
					<Mail className="w-12 h-12 text-slate-700 mx-auto mb-4" />
					<h3 className="text-xl font-medium text-slate-400">
						Nenhuma mensagem ainda
					</h3>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{contacts.map((contact) => (
						<Card
							key={contact.id}
							className={`bg-slate-900/60 border-slate-800 hover:border-primary/30 transition-all cursor-pointer group ${contact.status === "NEW" ? "ring-1 ring-primary/20 bg-primary/5" : ""}`}
							onClick={() => setSelectedContact(contact)}
						>
							<CardHeader className="pb-2">
								<div className="flex justify-between items-start mb-2">
									{getStatusBadge(contact.status)}
									<span className="text-[10px] text-slate-500 flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{new Date(
											contact.createdAt,
										).toLocaleDateString()}
									</span>
								</div>
								<CardTitle className="text-lg text-white group-hover:text-primary transition-colors">
									{contact.name}
								</CardTitle>
								<CardDescription className="text-xs truncate">
									{contact.project}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-slate-400 text-sm line-clamp-2 italic mb-4">
									"{contact.message}"
								</p>
								<div className="flex items-center gap-3 pt-2 border-t border-slate-800">
									<Button
										size="icon"
										variant="ghost"
										className="h-8 w-8 text-slate-400 hover:text-white"
									>
										<Eye className="w-4 h-4" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										className="h-8 w-8 text-slate-400 hover:text-red-400 ml-auto"
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(contact.id);
										}}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<Dialog
				open={!!selectedContact}
				onOpenChange={() => setSelectedContact(null)}
			>
				<DialogContent className="bg-slate-950 border-slate-800 text-white max-w-2xl">
					<DialogHeader>
						<div className="flex items-center gap-3 mb-2">
							<DialogTitle className="text-2xl">
								{selectedContact?.name}
							</DialogTitle>
							{selectedContact &&
								getStatusBadge(selectedContact.status)}
						</div>
						<DialogDescription className="text-primary font-medium">
							Interesse: {selectedContact?.project}
						</DialogDescription>
					</DialogHeader>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
						<div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
							<Mail className="w-4 h-4 text-primary" />
							<div>
								<p className="text-[10px] text-slate-500">
									Email
								</p>
								<p className="text-sm">
									{selectedContact?.email}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
							<Phone className="w-4 h-4 text-primary" />
							<div>
								<p className="text-[10px] text-slate-500">
									Telefone
								</p>
								<p className="text-sm">
									{selectedContact?.phone || "Não informado"}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
							<Building2 className="w-4 h-4 text-primary" />
							<div>
								<p className="text-[10px] text-slate-500">
									Empresa
								</p>
								<p className="text-sm">
									{selectedContact?.company ||
										"Não informado"}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
							<Calendar className="w-4 h-4 text-primary" />
							<div>
								<p className="text-[10px] text-slate-500">
									Data de Envio
								</p>
								<p className="text-sm">
									{selectedContact &&
										new Date(
											selectedContact.createdAt,
										).toLocaleString()}
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<h4 className="text-sm font-semibold text-slate-300">
							Mensagem:
						</h4>
						<div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-wrap italic">
							"{selectedContact?.message}"
						</div>
					</div>

					<div className="flex gap-3 mt-8">
						{selectedContact?.status === "NEW" && (
							<Button
								className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
								onClick={() =>
									handleStatusChange(
										selectedContact.id,
										"READ",
									)
								}
							>
								<CheckCircle2 className="w-4 h-4" /> Marcar como
								Lida
							</Button>
						)}
						{selectedContact?.status !== "ARCHIVED" && (
							<Button
								variant="outline"
								className="border-slate-700 hover:bg-slate-800 text-white"
								onClick={() =>
									handleStatusChange(
										selectedContact.id,
										"ARCHIVED",
									)
								}
							>
								Arquivar
							</Button>
						)}
						<Button
							variant="ghost"
							className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-auto"
							onClick={() => handleDelete(selectedContact!.id)}
						>
							<Trash2 className="w-4 h-4" /> Excluir
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ManageContacts;
