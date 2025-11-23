import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Member } from "../types/models";

interface MemberIndicatorProps {
  members: Member[];
  currentMemberIndex: number;
  flatListRef: React.RefObject<FlatList | null>;
}

export function MemberIndicator({
  members,
  currentMemberIndex,
  flatListRef,
}: MemberIndicatorProps) {
  return (
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
  );
}
