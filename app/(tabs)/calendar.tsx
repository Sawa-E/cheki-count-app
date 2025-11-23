import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarGrid } from "../../src/components/CalendarGrid";
import { MemoModal } from "../../src/components/MemoModal";
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
  const memos = useMemoStore((state) => state.memos || []);
  const setMemo = useMemoStore((state) => state.setMemo);
  const getMemo = useMemoStore((state) => state.getMemo);
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
  const selectedDateStr = useMemo(
    () => selectedDate.toISOString().split("T")[0],
    [selectedDate]
  );

  const dayRecords = useCountStore((state) =>
    state.records.filter((r) => r.date === selectedDateStr)
  );

  const dayMemo = useMemo(
    () => memos?.find((m: any) => m.date === selectedDateStr) || null,
    [memos, selectedDateStr]
  );

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

    setMemo(selectedDateStr, memoText.trim());
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
            deleteMemo(selectedDateStr);
            setShowMemoModal(false);
            setMemoText("");
          },
        },
      ]);
    }
  };

  // メモモーダルを閉じる
  const handleCloseMemoModal = () => {
    setShowMemoModal(false);
    setMemoText("");
  };

  // メモモーダルを開く
  const openMemoModal = () => {
    setMemoText(dayMemo || "");
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
        <CalendarGrid
          calendarDays={calendarDays}
          selectedDateStr={selectedDateStr}
          dateCountMap={dateCountMap}
          onSelectDate={setSelectedDate}
        />

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
              <Text className="text-gray-700">{dayMemo}</Text>
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
      <MemoModal
        visible={showMemoModal}
        selectedDate={selectedDate}
        memoText={memoText}
        hasMemo={!!dayMemo}
        onClose={handleCloseMemoModal}
        onMemoTextChange={setMemoText}
        onSave={handleSaveMemo}
        onDelete={handleDeleteMemo}
      />
    </SafeAreaView>
  );
}
