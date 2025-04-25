import api from "./ApiClient";
import type { UserType } from "../types";

// Login user
export const loginApi = async (credentials: { email: string; password: string }) => {
    try {
        console.log("Login request:", { url: "/login", data: credentials });
        const response = await api.post<{ success: boolean; user: UserType; message?: string }>("/login", credentials);
        console.log("Login response:", response.data);
        return response;
    } catch (err: any) {
        console.error("Login API error:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
        });
        throw err;
    }
};

// Register user
export const registerApi = async (userData: { email: string; password: string }) => {
    try {
        console.log("Register request:", { url: "/register", data: userData });
        const response = await api.post<{ success: boolean; user: UserType; message?: string }>("/register", userData);
        console.log("Register response:", response.data);
        return response;
    } catch (err: any) {
        console.error("Register API error:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
        });
        throw err;
    }
};