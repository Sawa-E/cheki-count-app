import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Member } from "../types/models";

interface MemberStore {
  members: Member[];
  selectedMemberId: string | null;

  addMember: (member: Omit<Member, "id" | "createdAt">) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  selectMember: (id: string) => void;

  getSelectedMember: () => Member | null;
  getMembersByGroup: (groupId: string) => Member[];
  getAllMembers: () => Member[];
}

export const useMemberStore = create<MemberStore>()(
  persist(
    (set, get) => ({
      members: [],
      selectedMemberId: null,

      addMember: (member) => {
        const newMember = {
          ...member,
          id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          members: [...state.members, newMember],
          selectedMemberId:
            state.members.length === 0 ? newMember.id : state.selectedMemberId,
        }));
      },

      updateMember: (id, updates) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      deleteMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          selectedMemberId:
            state.selectedMemberId === id ? null : state.selectedMemberId,
        })),

      selectMember: (id) => set({ selectedMemberId: id }),

      getSelectedMember: () => {
        const state = get();
        return (
          state.members.find((m) => m.id === state.selectedMemberId) || null
        );
      },

      getMembersByGroup: (groupId) => {
        return get()
          .members.filter((m) => m.groupId === groupId)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },

      getAllMembers: () => {
        return get().members.sort((a, b) => a.sortOrder - b.sortOrder);
      },
    }),
    {
      name: "member-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
