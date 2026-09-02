import axios from 'axios'
import { BASE_URL } from '../const/baseUrl'
import { USER_LOCALSTORAGE_KEY } from '../const/localstorage'

export const $api = axios.create({
  baseURL: BASE_URL,
})

$api.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization =
      localStorage.getItem(USER_LOCALSTORAGE_KEY) || ''
  }
  return config
})
