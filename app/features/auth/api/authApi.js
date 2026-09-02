import { api } from "../../../shared/api/client";

export const authApi = {
  login: async (creds) => {
    const { data } = await api.post("/users/login", creds);
    return {
      user: data.data,
      token: data.token,
    };
  },

  signup: async (payload) => {
    const { data } = await api.post("/users/signup", payload);
    return {
      user: data.data,
      token: data.token,
    };
  },

  logout: async () => {
  },

  getProfile: async () => {
    const { data } = await api.get("/users/me");
    return data.data;
  },

  updateProfile: async (payload) => {
    const { data } = await api.put("/users/me", payload);
    return data.data;
  },
};