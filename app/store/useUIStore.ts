import { create } from "zustand";

type UIState = {
  collapsed: boolean;
  toggleSidebar: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  collapsed: false,
  toggleSidebar: () =>
    set((state) => ({ collapsed: !state.collapsed })),
}));