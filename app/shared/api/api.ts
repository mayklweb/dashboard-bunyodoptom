import axios from "axios"
import { BASE_URL } from "../const/baseUrl"

export const $api = axios.create({ baseURL: BASE_URL })

$api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
