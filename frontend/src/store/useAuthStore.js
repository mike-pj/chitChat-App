import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async() => {
        try {
           const res = await axiosInstance.get("http://localhost:5001/api/auth/check"); 

           set({ authUser: res.data });

        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
           const res = await axiosInstance.post("http://localhost:5001/api/auth/signup", data, {
            headers: { "Content-Type": "application/json" } });
           set({ authUser: res.data });
           toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("http://localhost:5001/api/auth/login", data, {
             headers: { "Content-Type": "application/json" } });
            set({ authUser: res.data });
            toast.success("Logged in successfully");
         } catch (error) {
             toast.error(error.response.data.message)
         } finally {
             set({ isLoggingIn: false });
         }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("http://localhost:5001/api/auth/logout");
            set({ authUser: null });
           toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}));