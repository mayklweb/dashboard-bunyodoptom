"use client"

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minut 🔥
      // cacheTime: 1000 * 60 * 10, // 10 minut
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});