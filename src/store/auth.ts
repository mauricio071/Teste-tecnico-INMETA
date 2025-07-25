import { defineStore } from "pinia";
import type { User } from "@/types";
import { loginRequest, registerRequest } from "@/services/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    user: null as User | null,
  }),
  actions: {
    async login(email: string, password: string) {
      const data = await loginRequest(email, password);
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem("token", data.token);
    },
    async register(name: string, email: string, password: string) {
      await registerRequest(name, email, password);
      await this.login(email, password);
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
    },
  },
  persist: true,
});
