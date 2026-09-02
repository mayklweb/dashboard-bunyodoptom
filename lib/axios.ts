// lib/axios.ts
import axios from "axios"

export const api = axios.create({
  baseURL: "https://api.bunyodoptom.uz/api/v1",
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})