import { create } from "zustand";

type SettingState = {
  count: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
};

export const useSettingStore = create<SettingState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
