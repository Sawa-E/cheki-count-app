import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import { FlatList, Text, View, ViewToken } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateSelector } from "../../src/components/DateSelector";
import { MemberCard } from "../../src/components/MemberCard";
import { MemberIndicator } from "../../src/components/MemberIndicator";
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

  // ✅ 修正: selectorで直接フィルタリング
  const todayRecords = useCountStore((state) =>
    state.records.filter((r) => r.date === selectedDate)
  );

  const addRecord = useCountStore((state) => state.addRecord);

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
    const ticket = ticketTypes.find((t) => t.id === ticketTypeId);
    addRecord(memberId, ticketTypeId, 1, selectedDate, ticket?.price);
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
      <MemberCard
        member={member}
        ticketTypes={ticketTypes}
        total={total}
        getMemberTicketCount={getMemberTicketCount}
        onTicketPress={handleCount}
      />
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
      <DateSelector
        selectedDate={selectedDate}
        onChangeDate={changeDate}
        onGoToToday={goToToday}
        formatDate={formatDate}
        grandTotal={grandTotal}
      />

      {/* 推しインジケーター */}
      <MemberIndicator
        members={members}
        currentMemberIndex={currentMemberIndex}
        flatListRef={flatListRef}
      />

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
