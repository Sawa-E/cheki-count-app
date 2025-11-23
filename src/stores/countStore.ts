import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CountRecord } from "../types/models";

interface CountStore {
  records: CountRecord[];

  // Actions
  addCount: (
    memberId: string,
    ticketTypeId: string,
    count: number,
    pricePerItem: number
  ) => void;

  incrementCount: (
    memberId: string,
    ticketTypeId: string,
    price: number
  ) => void;
  decrementCount: (memberId: string, ticketTypeId: string) => void;

  updateRecord: (id: string, updates: Partial<CountRecord>) => void;
  deleteRecord: (id: string) => void;

  // Getters
  getRecordsByDate: (date: string) => CountRecord[];
  getTodayRecords: () => CountRecord[];
  getTodayCount: (memberId: string, ticketTypeId: string) => number;
}

export const useCountStore = create<CountStore>()(
  persist(
    (set, get) => ({
      records: [],

      addCount: (memberId, ticketTypeId, count, pricePerItem) => {
        const now = new Date();
        const date = now.toISOString().split("T")[0];

        set((state) => ({
          records: [
            ...state.records,
            {
              id: `record_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              date,
              timestamp: now.toISOString(),
              memberId,
              ticketTypeId,
              count,
              pricePerItem,
              totalPrice: count * pricePerItem,
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
            },
          ],
        }));
      },

      incrementCount: (memberId, ticketTypeId, price) => {
        const date = new Date().toISOString().split("T")[0];
        const state = get();

        const existingRecord = state.records.find(
          (r) =>
            r.date === date &&
            r.memberId === memberId &&
            r.ticketTypeId === ticketTypeId
        );

        if (existingRecord) {
          get().updateRecord(existingRecord.id, {
            count: existingRecord.count + 1,
          });
        } else {
          get().addCount(memberId, ticketTypeId, 1, price);
        }
      },

      decrementCount: (memberId, ticketTypeId) => {
        const date = new Date().toISOString().split("T")[0];
        const state = get();

        const existingRecord = state.records.find(
          (r) =>
            r.date === date &&
            r.memberId === memberId &&
            r.ticketTypeId === ticketTypeId
        );

        if (existingRecord && existingRecord.count > 0) {
          if (existingRecord.count === 1) {
            get().deleteRecord(existingRecord.id);
          } else {
            get().updateRecord(existingRecord.id, {
              count: existingRecord.count - 1,
            });
          }
        }
      },

      updateRecord: (id, updates) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id
              ? {
                  ...r,
                  ...updates,
                  totalPrice:
                    (updates.count || r.count) *
                    (updates.pricePerItem || r.pricePerItem),
                  updatedAt: new Date().toISOString(),
                }
              : r
          ),
        })),

      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),

      getRecordsByDate: (date) => {
        return get().records.filter((r) => r.date === date);
      },

      getTodayRecords: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().getRecordsByDate(today);
      },

      getTodayCount: (memberId, ticketTypeId) => {
        const today = new Date().toISOString().split("T")[0];
        const record = get().records.find(
          (r) =>
            r.date === today &&
            r.memberId === memberId &&
            r.ticketTypeId === ticketTypeId
        );
        return record ? record.count : 0;
      },
    }),
    {
      name: "count-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
