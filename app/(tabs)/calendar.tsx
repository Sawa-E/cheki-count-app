import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCountStore } from "../../src/stores/countStore";
import { useMemberStore } from "../../src/stores/memberStore";
import { useMemoStore } from "../../src/stores/memoStore";
import { useTicketStore } from "../../src/stores/ticketStore";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [memoText, setMemoText] = useState("");

  const records = useCountStore((state) => state.records);
  const members = useMemberStore((state) => state.members);
  const ticketTypes = useTicketStore((state) => state.ticketTypes);
  const memos = useMemoStore((state) => state.memos);
  const addMemo = useMemoStore((state) => state.addMemo);
  const updateMemo = useMemoStore((state) => state.updateMemo);
  const deleteMemo = useMemoStore((state) => state.deleteMemo);

  // 年月を変更
  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  // カレンダーの日付配列を生成
  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // 前月の空白
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 当月の日付
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [selectedDate]);

  // 選択された日付のデータ
  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  const dayRecords = useMemo(() => {
    return records.filter((r) => r.date === selectedDateStr);
  }, [records, selectedDateStr]);

  const dayMemo = (useMemos) => memos.find((m) => m.date === selectedDateStr);

  // 日付ごとのカウント数を計算
  const dateCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach((record) => {
      map[record.date] = (map[record.date] || 0) + record.count;
    });
    return map;
  }, [records]);

  // 集計データ
  const summary = useMemo(() => {
    const totalCount = dayRecords.reduce((sum, r) => sum + r.count, 0);
    const totalAmount = dayRecords.reduce((sum, r) => {
      const ticket = ticketTypes.find((t) => t.id === r.ticketTypeId);
      return sum + r.count * (ticket?.price || 0);
    }, 0);

    return { totalCount, totalAmount };
  }, [dayRecords, ticketTypes]);

  // メモの保存
  const handleSaveMemo = () => {
    if (!memoText.trim()) {
      Alert.alert("エラー", "メモを入力してください");
      return;
    }

    if (dayMemo) {
      updateMemo(dayMemo.id, memoText.trim());
    } else {
      addMemo(selectedDateStr, memoText.trim());
    }

    setShowMemoModal(false);
    setMemoText("");
  };

  // メモの削除
  const handleDeleteMemo = () => {
    if (dayMemo) {
      Alert.alert("確認", "このメモを削除しますか？", [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: () => {
            deleteMemo(dayMemo.id);
            setShowMemoModal(false);
            setMemoText("");
          },
        },
      ]);
    }
  };

  // メモモーダルを開く
  const openMemoModal = () => {
    setMemoText(dayMemo?.content || "");
    setShowMemoModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* ヘッダー */}
        <View className="bg-white p-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => changeMonth(-1)} className="p-2">
              <Ionicons name="chevron-back" size={24} color="#6366f1" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-gray-800">
              {selectedDate.getFullYear()}年 {selectedDate.getMonth() + 1}月
            </Text>

            <TouchableOpacity onPress={() => changeMonth(1)} className="p-2">
              <Ionicons name="chevron-forward" size={24} color="#6366f1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* カレンダー */}
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
              const isToday =
                dateStr === new Date().toISOString().split("T")[0];
              const count = dateCountMap[dateStr] || 0;
              const dayOfWeek = day.getDay();

              return (
                <TouchableOpacity
                  key={dateStr}
                  onPress={() => setSelectedDate(day)}
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

        {/* 選択日の詳細 */}
        <View className="bg-white m-4 rounded-xl shadow-sm p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-800">
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日の記録
            </Text>
            <TouchableOpacity
              onPress={openMemoModal}
              className="flex-row items-center"
            >
              <Ionicons name="create-outline" size={20} color="#6366f1" />
              <Text className="text-indigo-600 ml-1">メモ</Text>
            </TouchableOpacity>
          </View>

          {/* メモ表示 */}
          {dayMemo && (
            <View className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
              <Text className="text-gray-700">{dayMemo.content}</Text>
            </View>
          )}

          {/* 集計 */}
          <View className="flex-row mb-4">
            <View className="flex-1 bg-indigo-50 p-3 rounded-lg mr-2">
              <Text className="text-gray-600 text-xs mb-1">合計枚数</Text>
              <Text className="text-indigo-600 text-2xl font-bold">
                {summary.totalCount}枚
              </Text>
            </View>
            <View className="flex-1 bg-green-50 p-3 rounded-lg ml-2">
              <Text className="text-gray-600 text-xs mb-1">合計金額</Text>
              <Text className="text-green-600 text-2xl font-bold">
                ¥{summary.totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* 記録リスト */}
          {dayRecords.length > 0 ? (
            <View>
              <Text className="text-gray-600 font-medium mb-2">詳細</Text>
              {dayRecords.map((record) => {
                const member = members.find((m) => m.id === record.memberId);
                const ticket = ticketTypes.find(
                  (t) => t.id === record.ticketTypeId
                );

                return (
                  <View
                    key={record.id}
                    className="flex-row items-center justify-between py-2 border-b border-gray-100"
                  >
                    <View className="flex-1">
                      <Text className="text-gray-800 font-medium">
                        {member?.name || "不明"}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {ticket?.name || "不明"}
                      </Text>
                    </View>
                    <Text className="text-gray-800 font-bold">
                      {record.count}枚
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="items-center py-8">
              <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-400 mt-2">
                この日の記録はありません
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* メモモーダル */}
      <Modal
        visible={showMemoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMemoModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日のメモ
            </Text>

            <TextInput
              value={memoText}
              onChangeText={setMemoText}
              placeholder="メモを入力..."
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-800"
              style={{ textAlignVertical: "top" }}
            />

            <View className="flex-row justify-end space-x-2">
              {dayMemo && (
                <TouchableOpacity
                  onPress={handleDeleteMemo}
                  className="bg-red-500 px-4 py-2 rounded-lg mr-2"
                >
                  <Text className="text-white font-medium">削除</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  setShowMemoModal(false);
                  setMemoText("");
                }}
                className="bg-gray-300 px-4 py-2 rounded-lg mr-2"
              >
                <Text className="text-gray-700 font-medium">キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveMemo}
                className="bg-indigo-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
