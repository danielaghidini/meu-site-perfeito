import React, { useEffect, useState } from "react";
import {
	apiGetUsers,
	apiUpdateUser,
	apiDeleteUser,
	User,
} from "@/services/api";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "sonner";
import {
	Users,
	Shield,
	ShieldAlert,
	Trash2,
	MoreVertical,
	Mail,
	Calendar,
	User as UserIcon,
	Pencil,
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ManageUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [userToEdit, setUserToEdit] = useState<User | null>(null);
	const [editFormData, setEditFormData] = useState({ name: "", email: "" });
	const {
		token,
		user: currentUser,
		updateUser: updateGlobalUser,
	} = useAuth();

	const fetchUsers = async () => {
		if (!token) return;
		try {
			const data = await apiGetUsers(token);
			setUsers(data);
		} catch (error) {
			toast.error("Erro ao carregar usuários");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [token]);

	const handleRoleChange = async (userId: string, currentRole: string) => {
		if (!token) return;
		const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

		try {
			await apiUpdateUser(userId, { role: newRole }, token);
			toast.success(`Permissão atualizada para ${newRole}`);
			fetchUsers();
		} catch (error) {
			toast.error("Erro ao atualizar permissão");
		}
	};

	const handleDeleteUser = async () => {
		if (!token || !userToDelete) return;

		try {
			await apiDeleteUser(userToDelete.id, token);
			toast.success("Usuário excluído com sucesso");
			fetchUsers();
		} catch (error) {
			toast.error("Erro ao excluir usuário");
		} finally {
			setUserToDelete(null);
		}
	};

	const handleEditClick = (user: User) => {
		setUserToEdit(user);
		setEditFormData({
			name: user.name || "",
			email: user.email,
		});
	};

	const handleUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!token || !userToEdit) return;

		try {
			const updatedUser = await apiUpdateUser(
				userToEdit.id,
				editFormData,
				token,
			);
			toast.success("Usuário atualizado com sucesso");

			// Se o usuário editado for o logado, atualiza o contexto global
			if (userToEdit.id === currentUser?.id) {
				updateGlobalUser(updatedUser);
			}

			fetchUsers();
			setUserToEdit(null);
		} catch (error: any) {
			toast.error(error.message || "Erro ao atualizar usuário");
		}
	};

	return (
		<div className="space-y-8 font-inter">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-4xl font-bold text-white font-sora tracking-tight">
						Gerenciamento de Usuários
					</h1>
					<p className="text-slate-400 mt-2">
						Controle quem tem acesso ao painel administrativo.
					</p>
				</div>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3].map((n) => (
						<div
							key={n}
							className="h-48 bg-white/5 animate-pulse rounded-2xl border border-white/5"
						/>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{users.map((user) => (
						<Card
							key={user.id}
							className="bg-[#14181F] border-white/5 shadow-xl rounded-2xl overflow-hidden group hover:border-[#00E5FF]/20 transition-all"
						>
							<CardHeader className="pb-4 relative">
								<div className="flex justify-between items-start">
									<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A1F2C] to-[#0B0E14] border border-white/10 flex items-center justify-center text-[#00E5FF]/50">
										{user.role === "ADMIN" ? (
											<ShieldAlert size={24} />
										) : (
											<UserIcon size={24} />
										)}
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="text-slate-400 hover:text-white hover:bg-white/5"
											>
												<MoreVertical size={20} />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="bg-[#1A1F2C] border-white/10 text-white p-2 rounded-xl"
										>
											<DropdownMenuItem
												className="flex items-center gap-2 cursor-pointer focus:bg-white/5 rounded-lg py-3 px-4"
												onClick={() =>
													handleEditClick(user)
												}
											>
												<Pencil
													size={16}
													className="text-[#00E5FF]"
												/>
												Editar Informações
											</DropdownMenuItem>

											{user.id !== currentUser?.id && (
												<>
													<DropdownMenuItem
														className="flex items-center gap-2 cursor-pointer focus:bg-white/5 rounded-lg py-3 px-4"
														onClick={() =>
															handleRoleChange(
																user.id,
																user.role,
															)
														}
													>
														<Shield
															size={16}
															className="text-[#00E5FF]"
														/>
														Tornar{" "}
														{user.role === "ADMIN"
															? "Usuário"
															: "Admin"}
													</DropdownMenuItem>
													<DropdownMenuItem
														className="flex items-center gap-2 text-red-400 cursor-pointer focus:bg-red-500/10 focus:text-red-400 rounded-lg py-3 px-4"
														onClick={() =>
															setUserToDelete(
																user,
															)
														}
													>
														<Trash2 size={16} />
														Excluir Usuário
													</DropdownMenuItem>
												</>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>

								<CardTitle className="mt-4 text-xl text-white font-sora truncate">
									{user.name || "Sem nome"}
								</CardTitle>
								<CardDescription className="flex items-center gap-2 text-slate-500 mt-1">
									<Mail size={12} />
									{user.email}
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-4 pt-0">
								<div className="flex flex-wrap gap-2">
									<Badge
										className={`rounded-lg uppercase text-[10px] tracking-widest px-2 py-0.5 border-none ${
											user.role === "ADMIN"
												? "bg-[#7B61FF]/20 text-[#7B61FF]"
												: "bg-white/5 text-slate-400"
										}`}
									>
										{user.role}
									</Badge>
									{user.id === currentUser?.id && (
										<Badge
											variant="outline"
											className="rounded-lg text-[10px] border-white/5 text-slate-500"
										>
											VOCÊ
										</Badge>
									)}
								</div>

								<div className="flex items-center gap-2 text-xs text-slate-600 pt-4 border-t border-white/5">
									<Calendar size={12} />
									Desde{" "}
									{new Date(
										user.createdAt,
									).toLocaleDateString("pt-BR")}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Edit User Dialog */}
			<Dialog
				open={!!userToEdit}
				onOpenChange={() => setUserToEdit(null)}
			>
				<DialogContent className="bg-[#14181F] border-white/10 text-white rounded-3xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-sora">
							Editar Usuário
						</DialogTitle>
						<DialogDescription className="text-slate-400">
							Atualize as informações de perfil do usuário.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={handleUpdateUser}
						className="space-y-4 py-4"
					>
						<div className="space-y-2">
							<Label htmlFor="edit-name">Nome</Label>
							<Input
								id="edit-name"
								value={editFormData.name}
								onChange={(e) =>
									setEditFormData({
										...editFormData,
										name: e.target.value,
									})
								}
								className="bg-[#0B0E14] border-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#00E5FF] h-12 rounded-xl"
								placeholder="Nome do usuário"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-email">E-mail</Label>
							<Input
								id="edit-email"
								type="email"
								value={editFormData.email}
								onChange={(e) =>
									setEditFormData({
										...editFormData,
										email: e.target.value,
									})
								}
								className="bg-[#0B0E14] border-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-[#00E5FF] h-12 rounded-xl"
								placeholder="exemplo@email.com"
								required
							/>
						</div>
						<DialogFooter className="mt-8">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setUserToEdit(null)}
								className="text-slate-400 hover:text-white"
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								className="bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] hover:opacity-90 text-white font-bold rounded-xl px-8"
							>
								Salvar Alterações
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!userToDelete}
				onOpenChange={() => setUserToDelete(null)}
			>
				<AlertDialogContent className="bg-[#14181F] border-white/10 text-white rounded-3xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-2xl font-sora">
							Tem certeza?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-slate-400">
							Esta ação não pode ser desfeita. O usuário{" "}
							<strong>
								{userToDelete?.name || userToDelete?.email}
							</strong>{" "}
							perderá permanentemente o acesso ao painel.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="mt-6">
						<AlertDialogCancel className="bg-white/5 border-white/5 text-white hover:bg-white/10 rounded-xl">
							Cancelar
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteUser}
							className="bg-red-600 hover:bg-red-500 text-white border-none rounded-xl"
						>
							Excluir Permanentemente
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default ManageUsers;
