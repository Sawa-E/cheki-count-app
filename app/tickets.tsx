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
import { useTicketStore } from "../src/stores/ticketStore";

export default function TicketsScreen() {
  const router = useRouter();
  const groups = useGroupStore((state) => state.getAllGroups());
  const tickets = useTicketStore((state) => state.getAllTickets());
  const addTicketType = useTicketStore((state) => state.addTicketType);
  const deleteTicketType = useTicketStore((state) => state.deleteTicketType);

  const [newTicketName, setNewTicketName] = useState("");
  const [newTicketPrice, setNewTicketPrice] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || "");
  const [selectedColor, setSelectedColor] = useState("#BFDBFE");
  const [isAdding, setIsAdding] = useState(false);

  const ticketColors = [
    { name: "ブルー", value: "#BFDBFE" },
    { name: "オレンジ", value: "#FED7AA" },
    { name: "パープル", value: "#DDD6FE" },
    { name: "レッド", value: "#FECACA" },
    { name: "グリーン", value: "#BBF7D0" },
    { name: "イエロー", value: "#FEF08A" },
  ];

  const handleAddTicket = () => {
    if (!newTicketName.trim()) {
      Alert.alert("エラー", "券種名を入力してください");
      return;
    }

    const price = parseInt(newTicketPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert("エラー", "正しい単価を入力してください");
      return;
    }

    if (!selectedGroupId) {
      Alert.alert("エラー", "グループを選択してください");
      return;
    }

    addTicketType({
      groupId: selectedGroupId,
      name: newTicketName.trim(),
      category: "other",
      price: price,
      color: selectedColor,
      sortOrder: tickets.length,
      isActive: true,
    });

    setNewTicketName("");
    setNewTicketPrice("");
    setIsAdding(false);
    Alert.alert("完了", "券種を追加しました");
  };

  const handleDeleteTicket = (ticketId: string, ticketName: string) => {
    Alert.alert("券種を削除", `「${ticketName}」を削除しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => {
          deleteTicketType(ticketId);
          Alert.alert("完了", "券種を削除しました");
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
            <Text className="text-xl font-bold text-gray-900">券種管理</Text>
          </View>
        </View>

        <View className="p-4">
          {/* 券種リスト */}
          {tickets.map((ticket) => (
            <View
              key={ticket.id}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <View
                      style={{ backgroundColor: ticket.color }}
                      className="w-4 h-4 rounded mr-2"
                    />
                    <Text className="text-gray-900 font-semibold text-base">
                      {ticket.name}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-sm ml-6">
                    {getGroupName(ticket.id)} | ¥{ticket.price.toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteTicket(ticket.id, ticket.name)}
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
              <Text className="text-gray-500 font-medium">+ 券種を追加</Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Text className="text-sm text-gray-700 mb-2">券種名</Text>
              <TextInput
                value={newTicketName}
                onChangeText={setNewTicketName}
                placeholder="例: チェキ券"
                placeholderTextColor="#9CA3AF"
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 mb-3"
                autoFocus
              />

              <Text className="text-sm text-gray-700 mb-2">単価（円）</Text>
              <TextInput
                value={newTicketPrice}
                onChangeText={setNewTicketPrice}
                placeholder="例: 1000"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 mb-3"
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

              <Text className="text-sm text-gray-700 mb-2">カラー</Text>
              <View className="flex-row flex-wrap gap-2 mb-3">
                {ticketColors.map((color) => (
                  <TouchableOpacity
                    key={color.value}
                    onPress={() => setSelectedColor(color.value)}
                    className="items-center"
                  >
                    <View
                      style={{ backgroundColor: color.value }}
                      className={`w-10 h-10 rounded ${
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
                    setNewTicketName("");
                    setNewTicketPrice("");
                  }}
                  className="flex-1 bg-gray-200 rounded-lg py-2"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-700 text-center font-medium">
                    キャンセル
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddTicket}
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
