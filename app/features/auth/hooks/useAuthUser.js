// src/features/auth/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../model/useAuthStore";
import { useNavigate } from "react-router-dom";


// 🔐 LOGIN
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, token }) => {
      login(token); // ✅ ishlaydi

      queryClient.setQueryData(["user"], user);

      navigate("/");
    },
  });
}


// 📝 SIGNUP
export function useSignup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const signup = useAuthStore((s) => s.signup);

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: ({ user, token }) => {
      signup(token);
      // setToken(token);
      // setUser(user);

      queryClient.setQueryData(["user"], user);

      navigate("/");
    },
  });
}


// 👤 GET PROFILE
export function useProfile() {

  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["user"],
    queryFn: authApi.getProfile,
    enabled: !!token, // 🔥 MUHIM
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}


// ✏️ UPDATE PROFILE
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(["user"], updatedUser);
    },
  });
}


// 🚪 LOGOUT
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutStore = useAuthStore((s) => s.logout);

  return () => {
    logoutStore(); // 🔥 tokenni o‘chiradi
    queryClient.clear(); // 🔥 cache tozalaydi
    navigate("/login");
  };
}