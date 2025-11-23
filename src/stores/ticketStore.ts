import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TicketType } from "../types/models";

interface TicketStore {
  ticketTypes: TicketType[];

  addTicketType: (ticket: Omit<TicketType, "id" | "createdAt">) => void;
  updateTicketType: (id: string, updates: Partial<TicketType>) => void;
  deleteTicketType: (id: string) => void;

  getTicketsByGroup: (groupId: string) => TicketType[];
  getActiveTicketsByGroup: (groupId: string) => TicketType[];
  getTicketById: (id: string) => TicketType | null;
  getAllTickets: () => TicketType[];
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      ticketTypes: [],

      addTicketType: (ticket) =>
        set((state) => ({
          ticketTypes: [
            ...state.ticketTypes,
            {
              ...ticket,
              id: `ticket_${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 11)}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateTicketType: (id, updates) =>
        set((state) => ({
          ticketTypes: state.ticketTypes.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTicketType: (id) =>
        set((state) => ({
          ticketTypes: state.ticketTypes.filter((t) => t.id !== id),
        })),

      getTicketsByGroup: (groupId) => {
        return get()
          .ticketTypes.filter((t) => t.groupId === groupId)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },

      getActiveTicketsByGroup: (groupId) => {
        return get()
          .ticketTypes.filter((t) => t.groupId === groupId && t.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },

      getTicketById: (id) => {
        return get().ticketTypes.find((t) => t.id === id) || null;
      },

      getAllTickets: () => {
        return get().ticketTypes.sort((a, b) => a.sortOrder - b.sortOrder);
      },
    }),
    {
      name: "ticket-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
