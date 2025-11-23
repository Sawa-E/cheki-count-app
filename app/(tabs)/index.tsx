import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCountStore } from "../../src/stores/countStore";
import { useGroupStore } from "../../src/stores/groupStore";
import { useMemberStore } from "../../src/stores/memberStore";
import { useTicketStore } from "../../src/stores/ticketStore";

export default function CountScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const selectedGroupId = useGroupStore((state) => state.selectedGroupId);
  const members = useMemberStore((state) =>
    state.members.filter((m) => m.groupId === selectedGroupId)
  );
  const ticketTypes = useTicketStore((state) => state.ticketTypes);
  const records = useCountStore((state) => state.records);
  const addRecord = useCountStore((state) => state.addRecord);

  // 選択された日付のレコードのみフィルタ
  const todayRecords = useMemo(() => {
    return records.filter((r) => r.date === selectedDate);
  }, [records, selectedDate]);

  // 日付変更
  const changeDate = (direction: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + direction);
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  // 今日に戻る
  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  // 日付フォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = dateStr;
    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (dateOnly === todayStr) {
      return "今日";
    } else if (dateOnly === yesterdayStr) {
      return "昨日";
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // カウント追加
  const handleCount = (memberId: string, ticketTypeId: string) => {
    addRecord(memberId, ticketTypeId, 1, selectedDate);
  };

  // 推しごとの券種別カウント集計
  const getMemberTicketCount = (memberId: string, ticketTypeId: string) => {
    return todayRecords
      .filter((r) => r.memberId === memberId && r.ticketTypeId === ticketTypeId)
      .reduce((sum, r) => sum + r.count, 0);
  };

  // 推しごとの合計
  const getMemberTotal = (memberId: string) => {
    const memberRecords = todayRecords.filter((r) => r.memberId === memberId);
    const count = memberRecords.reduce((sum, r) => sum + r.count, 0);
    const amount = memberRecords.reduce((sum, r) => {
      const ticket = ticketTypes.find((t) => t.id === r.ticketTypeId);
      return sum + r.count * (ticket?.price || 0);
    }, 0);
    return { count, amount };
  };

  // 全体の合計
  const grandTotal = useMemo(() => {
    const count = todayRecords.reduce((sum, r) => sum + r.count, 0);
    const amount = todayRecords.reduce((sum, r) => {
      const ticket = ticketTypes.find((t) => t.id === r.ticketTypeId);
      return sum + r.count * (ticket?.price || 0);
    }, 0);
    return { count, amount };
  }, [todayRecords, ticketTypes]);

  // 推し切り替え時のコールバック
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentMemberIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // メンバーカードのレンダリング
  const renderMemberCard = ({
    item: member,
  }: {
    item: (typeof members)[0];
  }) => {
    const total = getMemberTotal(member.id);

    return (
      <View className="w-screen px-4">
        {/* 推し情報 */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <View className="items-center mb-4">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: member.color }}
            >
              <Text className="text-white text-3xl font-bold">
                {member.name.charAt(0)}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              {member.name}
            </Text>
          </View>

          {/* 今日の合計 */}
          <View className="flex-row bg-gray-50 rounded-lg p-3 mb-4">
            <View className="flex-1 items-center border-r border-gray-200">
              <Text className="text-gray-600 text-xs mb-1">今日の枚数</Text>
              <Text className="text-indigo-600 text-xl font-bold">
                {total.count}枚
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-gray-600 text-xs mb-1">今日の金額</Text>
              <Text className="text-green-600 text-xl font-bold">
                ¥{total.amount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* 券種リスト */}
          <ScrollView className="max-h-96">
            {ticketTypes.map((ticket) => {
              const count = getMemberTicketCount(member.id, ticket.id);

              return (
                <View
                  key={ticket.id}
                  className="mb-3 rounded-lg overflow-hidden"
                  style={{ backgroundColor: ticket.color }}
                >
                  <TouchableOpacity
                    onPress={() => handleCount(member.id, ticket.id)}
                    className="p-4"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-1">
                        <Text className="text-white text-lg font-bold mb-1">
                          {ticket.name}
                        </Text>
                        <Text className="text-white/90 text-sm">
                          ¥{ticket.price.toLocaleString()}
                        </Text>
                      </View>
                      <View className="bg-white/20 px-4 py-2 rounded-lg">
                        <Text className="text-white font-bold text-lg">
                          {count}枚
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-white/80 text-xs">
                        タップしてカウント
                      </Text>
                      <View className="bg-white/30 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-medium">
                          +1
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

  if (members.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="people-outline" size={64} color="#d1d5db" />
          <Text className="text-gray-400 text-lg mt-4 text-center">
            メンバーが登録されていません
          </Text>
          <Text className="text-gray-400 text-sm mt-2 text-center">
            設定からメンバーを追加してください
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* 日付変更ヘッダー */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => changeDate(-1)}
            className="p-2 bg-gray-100 rounded-lg"
          >
            <Ionicons name="chevron-back" size={24} color="#6366f1" />
          </TouchableOpacity>

          <View className="flex-1 items-center mx-4">
            <TouchableOpacity
              onPress={goToToday}
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
            onPress={() => changeDate(1)}
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

      {/* 推しインジケーター */}
      <View className="bg-white border-b border-gray-200 py-3">
        <View className="flex-row justify-center items-center space-x-2">
          {members.map((member, index) => (
            <TouchableOpacity
              key={member.id}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index,
                  animated: true,
                });
              }}
              className="items-center"
            >
              {/* ドットインジケーター */}
              <View
                className={`rounded-full mb-1 ${
                  index === currentMemberIndex
                    ? "w-8 h-2"
                    : "w-2 h-2 opacity-40"
                }`}
                style={{ backgroundColor: member.color }}
              />
              {/* 名前表示（選択中のみ） */}
              {index === currentMemberIndex && (
                <Text className="text-xs text-gray-600 font-medium">
                  {member.name}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ページ番号 */}
        <Text className="text-center text-gray-400 text-xs mt-2">
          {currentMemberIndex + 1} / {members.length}
        </Text>
      </View>

      {/* 推しカードのスワイプリスト */}
      <FlatList
        ref={flatListRef}
        data={members}
        renderItem={renderMemberCard}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: 400, // 画面幅の概算
          offset: 400 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}
