/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (token: string, user: User) => void;
	updateUser: (user: User) => void;
	logout: () => void;
	isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const savedToken = localStorage.getItem("token");
		const savedUser = localStorage.getItem("user");
		if (savedToken && savedUser) {
			setToken(savedToken);
			setUser(JSON.parse(savedUser));
		}
		setIsLoading(false);
	}, []);

	const login = (newToken: string, newUser: User) => {
		setToken(newToken);
		setUser(newUser);
		localStorage.setItem("token", newToken);
		localStorage.setItem("user", JSON.stringify(newUser));
	};

	const updateUser = (updatedUser: User) => {
		setUser(updatedUser);
		localStorage.setItem("user", JSON.stringify(updatedUser));
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider
			value={{ user, token, login, updateUser, logout, isLoading }}
		>
			{children}
		</AuthContext.Provider>
	);
};
