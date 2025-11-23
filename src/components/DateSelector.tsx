import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DateSelectorProps {
  selectedDate: string;
  onChangeDate: (direction: number) => void;
  onGoToToday: () => void;
  formatDate: (dateStr: string) => string;
  grandTotal: { count: number; amount: number };
}

export function DateSelector({
  selectedDate,
  onChangeDate,
  onGoToToday,
  formatDate,
  grandTotal,
}: DateSelectorProps) {
  return (
    <View className="bg-white border-b border-gray-200 px-4 py-3">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => onChangeDate(-1)}
          className="p-2 bg-gray-100 rounded-lg"
        >
          <Ionicons name="chevron-back" size={24} color="#6366f1" />
        </TouchableOpacity>

        <View className="flex-1 items-center mx-4">
          <TouchableOpacity
            onPress={onGoToToday}
            className="px-4 py-2 bg-indigo-50 rounded-lg"
          >
            <Text className="text-indigo-600 font-bold text-lg">
              {formatDate(selectedDate)}
            </Text>
            {selectedDate !== new Date().toISOString().split("T")[0] && (
              <Text className="text-indigo-400 text-xs text-center mt-0.5">
                タップで今日に戻る
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onChangeDate(1)}
          className="p-2 bg-gray-100 rounded-lg"
        >
          <Ionicons name="chevron-forward" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* 全体の合計 */}
      <View className="flex-row mt-3 pt-3 border-t border-gray-100">
        <View className="flex-1 items-center">
          <Text className="text-gray-500 text-xs mb-1">合計枚数</Text>
          <Text className="text-indigo-600 text-lg font-bold">
            {grandTotal.count}枚
          </Text>
        </View>
        <View className="flex-1 items-center border-l border-gray-200">
          <Text className="text-gray-500 text-xs mb-1">合計金額</Text>
          <Text className="text-green-600 text-lg font-bold">
            ¥{grandTotal.amount.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}
