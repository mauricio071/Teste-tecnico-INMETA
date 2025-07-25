import api from "./api";

export async function loginRequest(email: string, password: string) {
  const res = await api.post("/login", { email, password });
  return res.data;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
) {
  const res = await api.post("/register", { name, email, password });
  return res.data;
}
