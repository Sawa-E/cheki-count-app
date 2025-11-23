import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CalendarGridProps {
  calendarDays: (Date | null)[];
  selectedDateStr: string;
  dateCountMap: Record<string, number>;
  onSelectDate: (date: Date) => void;
}

export function CalendarGrid({
  calendarDays,
  selectedDateStr,
  dateCountMap,
  onSelectDate,
}: CalendarGridProps) {
  return (
    <View className="bg-white m-4 rounded-xl shadow-sm p-4">
      {/* 曜日ヘッダー */}
      <View className="flex-row mb-2">
        {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
          <View key={day} className="flex-1 items-center">
            <Text
              className={`font-bold ${
                index === 0
                  ? "text-red-500"
                  : index === 6
                  ? "text-blue-500"
                  : "text-gray-600"
              }`}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 日付グリッド */}
      <View className="flex-row flex-wrap">
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <View
                key={`empty-${index}`}
                className="w-[14.28%] aspect-square p-1"
              />
            );
          }

          const dateStr = day.toISOString().split("T")[0];
          const isSelected = dateStr === selectedDateStr;
          const isToday = dateStr === new Date().toISOString().split("T")[0];
          const count = dateCountMap[dateStr] || 0;
          const dayOfWeek = day.getDay();

          return (
            <TouchableOpacity
              key={dateStr}
              onPress={() => onSelectDate(day)}
              className="w-[14.28%] aspect-square p-1"
            >
              <View
                className={`flex-1 items-center justify-center rounded-lg ${
                  isSelected
                    ? "bg-indigo-500"
                    : isToday
                    ? "bg-indigo-100"
                    : ""
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected
                      ? "text-white"
                      : dayOfWeek === 0
                      ? "text-red-500"
                      : dayOfWeek === 6
                      ? "text-blue-500"
                      : "text-gray-800"
                  }`}
                >
                  {day.getDate()}
                </Text>
                {count > 0 && (
                  <View className="mt-0.5">
                    <Text
                      className={`text-[10px] ${
                        isSelected ? "text-white" : "text-indigo-600"
                      }`}
                    >
                      {count}枚
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
