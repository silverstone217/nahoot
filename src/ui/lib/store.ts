import { create } from "zustand";

type PropsType = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const useStore = create<PropsType>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
