import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MemoState {
  memos: Record<string, string>; // { "2025-01-15": "メモ内容" }
  getMemo: (date: string) => string | null;
  setMemo: (date: string, content: string) => void;
  deleteMemo: (date: string) => void;
}

export const useMemoStore = create<MemoState>()(
  persist(
    (set, get) => ({
      memos: {},

      getMemo: (date) => {
        return get().memos[date] || null;
      },

      setMemo: (date, content) =>
        set((state) => ({
          memos: {
            ...state.memos,
            [date]: content,
          },
        })),

      deleteMemo: (date) =>
        set((state) => {
          const newMemos = { ...state.memos };
          delete newMemos[date];
          return { memos: newMemos };
        }),
    }),
    {
      name: "memo-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
