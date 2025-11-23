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

export default function GroupsScreen() {
  const router = useRouter();
  const groups = useGroupStore((state) => state.getAllGroups());
  const addGroup = useGroupStore((state) => state.addGroup);
  const deleteGroup = useGroupStore((state) => state.deleteGroup);

  const [newGroupName, setNewGroupName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert("エラー", "グループ名を入力してください");
      return;
    }

    addGroup({
      name: newGroupName.trim(),
      color: "#E3F2FD",
      sortOrder: groups.length,
    });

    setNewGroupName("");
    setIsAdding(false);
    Alert.alert("完了", "グループを追加しました");
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    Alert.alert("グループを削除", `「${groupName}」を削除しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => {
          deleteGroup(groupId);
          Alert.alert("完了", "グループを削除しました");
        },
      },
    ]);
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
            <Text className="text-xl font-bold text-gray-900">
              グループ管理
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* グループリスト */}
          {groups.map((group) => (
            <View
              key={group.id}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base">
                    {group.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteGroup(group.id, group.name)}
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
              <Text className="text-gray-500 font-medium">
                + グループを追加
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Text className="text-sm text-gray-700 mb-2">グループ名</Text>
              <TextInput
                value={newGroupName}
                onChangeText={setNewGroupName}
                placeholder="例: IMMM、箱A"
                placeholderTextColor="#9CA3AF"
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 mb-3"
                autoFocus
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => {
                    setIsAdding(false);
                    setNewGroupName("");
                  }}
                  className="flex-1 bg-gray-200 rounded-lg py-2"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-700 text-center font-medium">
                    キャンセル
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddGroup}
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
