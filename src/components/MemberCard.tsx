import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Member, TicketType } from "../types/models";
import { TicketCard } from "./TicketCard";

interface MemberCardProps {
  member: Member;
  ticketTypes: TicketType[];
  total: { count: number; amount: number };
  getMemberTicketCount: (memberId: string, ticketTypeId: string) => number;
  onTicketPress: (memberId: string, ticketTypeId: string) => void;
}

export function MemberCard({
  member,
  ticketTypes,
  total,
  getMemberTicketCount,
  onTicketPress,
}: MemberCardProps) {
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
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                count={count}
                onPress={() => onTicketPress(member.id, ticket.id)}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
