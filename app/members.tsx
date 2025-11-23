import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGroupStore } from "../src/stores/groupStore";
import { useMemberStore } from "../src/stores/memberStore";

export default function MembersScreen() {
  const router = useRouter();
  const groups = useGroupStore((state) => state.getAllGroups());
  const members = useMemberStore((state) => state.getAllMembers());
  const addMember = useMemberStore((state) => state.addMember);
  const deleteMember = useMemberStore((state) => state.deleteMember);

  const [newMemberName, setNewMemberName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || "");
  const [selectedColor, setSelectedColor] = useState("#FCE4EC");
  const [isAdding, setIsAdding] = useState(false);

  const colors = [
    { name: "ピンク", value: "#FCE4EC" },
    { name: "ブルー", value: "#E3F2FD" },
    { name: "イエロー", value: "#FFF9C4" },
    { name: "グリーン", value: "#E8F5E9" },
    { name: "パープル", value: "#F3E5F5" },
    { name: "オレンジ", value: "#FFE0B2" },
  ];

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      Alert.alert("エラー", "推し名を入力してください");
      return;
    }

    if (!selectedGroupId) {
      Alert.alert("エラー", "グループを選択してください");
      return;
    }

    addMember({
      groupId: selectedGroupId,
      name: newMemberName.trim(),
      displayName: newMemberName.trim(),
      color: selectedColor,
      sortOrder: members.length,
      isFavorite: false,
    });

    setNewMemberName("");
    setIsAdding(false);
    Alert.alert("完了", "推しを追加しました");
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    Alert.alert("推しを削除", `「${memberName}」を削除しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => {
          deleteMember(memberId);
          Alert.alert("完了", "推しを削除しました");
        },
      },
    ]);
  };

  const getGroupName = (groupId: string) => {
    return groups.find((g) => g.id === groupId)?.name || "不明";
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* ヘッダー */}
        <View className="px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Text className="text-blue-600 text-base">‹ 戻る</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">推し管理</Text>
          </View>
        </View>

        <View className="p-4">
          {/* メンバーリスト */}
          {members.map((member) => (
            <View
              key={member.id}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <View
                      style={{ backgroundColor: member.color }}
                      className="w-4 h-4 rounded-full mr-2"
                    />
                    <Text className="text-gray-900 font-semibold text-base">
                      {member.name}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-sm ml-6">
                    {getGroupName(member.groupId)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteMember(member.id, member.name)}
                  className="ml-3 px-3 py-1 bg-red-50 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Text className="text-red-600 text-sm font-medium">削除</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* 追加ボタン/フォーム */}
          {!isAdding ? (
            <TouchableOpacity
              onPress={() => setIsAdding(true)}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-gray-500 font-medium">+ 推しを追加</Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Text className="text-sm text-gray-700 mb-2">推し名</Text>
              <TextInput
                value={newMemberName}
                onChangeText={setNewMemberName}
                placeholder="例: 藤乃さや"
                placeholderTextColor="#9CA3AF"
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 mb-3"
                autoFocus
              />

              <Text className="text-sm text-gray-700 mb-2">グループ</Text>
              <View className="mb-3">
                {groups.map((group) => (
                  <TouchableOpacity
                    key={group.id}
                    onPress={() => setSelectedGroupId(group.id)}
                    className={`border rounded-lg px-3 py-2 mb-2 ${
                      selectedGroupId === group.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={
                        selectedGroupId === group.id
                          ? "text-blue-700 font-medium"
                          : "text-gray-900"
                      }
                    >
                      {group.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-sm text-gray-700 mb-2">推しカラー</Text>
              <View className="flex-row flex-wrap gap-2 mb-3">
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color.value}
                    onPress={() => setSelectedColor(color.value)}
                    className="items-center"
                  >
                    <View
                      style={{ backgroundColor: color.value }}
                      className={`w-10 h-10 rounded-full ${
                        selectedColor === color.value
                          ? "border-4 border-blue-500"
                          : "border-2 border-gray-300"
                      }`}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => {
                    setIsAdding(false);
                    setNewMemberName("");
                  }}
                  className="flex-1 bg-gray-200 rounded-lg py-2"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-700 text-center font-medium">
                    キャンセル
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddMember}
                  className="flex-1 bg-blue-500 rounded-lg py-2"
                  activeOpacity={0.7}
                >
                  <Text className="text-white text-center font-medium">
                    追加
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
