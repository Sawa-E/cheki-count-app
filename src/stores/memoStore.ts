import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MemoStore {
  memos: Record<string, string>; // date: memo

  setMemo: (date: string, memo: string) => void;
  getMemo: (date: string) => string;
  deleteMemo: (date: string) => void;
}

export const useMemoStore = create<MemoStore>()(
  persist(
    (set, get) => ({
      memos: {},

      setMemo: (date, memo) =>
        set((state) => ({
          memos: { ...state.memos, [date]: memo },
        })),

      getMemo: (date) => {
        return get().memos[date] || "";
      },

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
