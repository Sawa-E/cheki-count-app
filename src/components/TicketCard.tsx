import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TicketType } from "../types/models";

interface TicketCardProps {
  ticket: TicketType;
  count: number;
  onPress: () => void;
}

export function TicketCard({ ticket, count, onPress }: TicketCardProps) {
  return (
    <View
      className="mb-3 rounded-lg overflow-hidden"
      style={{ backgroundColor: ticket.color }}
    >
      <TouchableOpacity onPress={onPress} className="p-4" activeOpacity={0.7}>
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
            <Text className="text-white font-bold text-lg">{count}枚</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-white/80 text-xs">タップしてカウント</Text>
          <View className="bg-white/30 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">+1</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
