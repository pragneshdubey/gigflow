import api from "../api/axios";

export const logout = async () => {
  await api.post("/auth/logout", {}, { withCredentials: true });
};
