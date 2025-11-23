import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Group } from "../types/models";

interface GroupStore {
  groups: Group[];

  addGroup: (group: Omit<Group, "id" | "createdAt">) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;

  getAllGroups: () => Group[];
  getGroupById: (id: string) => Group | null;
}

export const useGroupStore = create<GroupStore>()(
  persist(
    (set, get) => ({
      groups: [],

      addGroup: (group) =>
        set((state) => ({
          groups: [
            ...state.groups,
            {
              ...group,
              id: `group_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateGroup: (id, updates) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),

      deleteGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
        })),

      getAllGroups: () => {
        return get().groups.sort((a, b) => a.sortOrder - b.sortOrder);
      },

      getGroupById: (id) => {
        return get().groups.find((g) => g.id === id) || null;
      },
    }),
    {
      name: "group-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
