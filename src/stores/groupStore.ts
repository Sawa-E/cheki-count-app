import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Group } from "../types/models";

interface GroupStore {
  groups: Group[];
  selectedGroupId: string | null;

  addGroup: (group: Omit<Group, "id" | "createdAt">) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  selectGroup: (id: string) => void;

  getAllGroups: () => Group[];
  getGroupById: (id: string) => Group | null;
}

export const useGroupStore = create<GroupStore>()(
  persist(
    (set, get) => ({
      groups: [],
      selectedGroupId: null,

      addGroup: (group) => {
        const newGroup = {
          ...group,
          id: `group_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 11)}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          groups: [...state.groups, newGroup],
          selectedGroupId:
            state.groups.length === 0 ? newGroup.id : state.selectedGroupId,
        }));
      },

      updateGroup: (id, updates) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),

      deleteGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          selectedGroupId:
            state.selectedGroupId === id ? null : state.selectedGroupId,
        })),

      selectGroup: (id) => set({ selectedGroupId: id }),

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
