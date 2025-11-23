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
import { useTicketStore } from "../src/stores/ticketStore";

export default function SetupScreen() {
  const router = useRouter();

  const addGroup = useGroupStore((state) => state.addGroup);
  const addMember = useMemberStore((state) => state.addMember);
  const addTicketType = useTicketStore((state) => state.addTicketType);

  // フォーム状態
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");

  // カラーピッカー用
  const colors = [
    { name: "ピンク", value: "#FCE4EC" },
    { name: "ブルー", value: "#E3F2FD" },
    { name: "イエロー", value: "#FFF9C4" },
    { name: "グリーン", value: "#E8F5E9" },
    { name: "パープル", value: "#F3E5F5" },
    { name: "オレンジ", value: "#FFE0B2" },
  ];

  const [selectedMemberColor, setSelectedMemberColor] = useState(
    colors[0].value
  );

  // デフォルト券種
  const defaultTickets = [
    {
      name: "チェキ券",
      price: 1000,
      category: "cheki" as const,
      color: "#BFDBFE",
    },
    {
      name: "写メ券",
      price: 1500,
      category: "shamekai" as const,
      color: "#FED7AA",
    },
    {
      name: "動画券",
      price: 2000,
      category: "video" as const,
      color: "#DDD6FE",
    },
    {
      name: "グッズ",
      price: 500,
      category: "goods" as const,
      color: "#FECACA",
    },
  ];

  const handleComplete = () => {
    // バリデーション
    if (!groupName.trim()) {
      Alert.alert("エラー", "グループ名を入力してください");
      return;
    }

    if (!memberName.trim()) {
      Alert.alert("エラー", "推し名を入力してください");
      return;
    }

    // グループを追加
    addGroup({
      name: groupName,
      color: "#E3F2FD",
      sortOrder: 0,
    });

    // グループIDを取得
    setTimeout(() => {
      const groups = useGroupStore.getState().groups;
      const newGroup = groups[groups.length - 1];

      // 推しを追加
      addMember({
        groupId: newGroup.id,
        name: memberName,
        displayName: memberName,
        color: selectedMemberColor,
        sortOrder: 0,
        isFavorite: true,
      });

      // デフォルト券種を追加（少しずつ遅延させる）
      defaultTickets.forEach((ticket, index) => {
        setTimeout(() => {
          addTicketType({
            groupId: newGroup.id,
            name: ticket.name,
            category: ticket.category,
            price: ticket.price,
            color: ticket.color,
            sortOrder: index,
            isActive: true,
          });
        }, index * 10); // 10msずつずらす
      });

      // メイン画面へ（券種追加を待つ）
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 150);
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* ヘッダー */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              初期設定
            </Text>
            <Text className="text-base text-gray-600">
              アプリを使うために、基本情報を登録しましょう
            </Text>
          </View>

          {/* ステップ1: グループ */}
          <View className="mb-8">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-3">
                <Text className="text-white font-bold">1</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900">
                グループ名
              </Text>
            </View>
            <Text className="text-sm text-gray-600 mb-3 ml-11">
              よく行くライブやアイドルグループ名を入力
            </Text>
            <TextInput
              value={groupName}
              onChangeText={setGroupName}
              placeholder="例: IMMM、箱A、推しグループ"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 ml-11"
            />
          </View>

          {/* ステップ2: 推し */}
          <View className="mb-8">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-3">
                <Text className="text-white font-bold">2</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900">
                推しの名前
              </Text>
            </View>
            <Text className="text-sm text-gray-600 mb-3 ml-11">
              最初の推しを1人登録（後で追加できます）
            </Text>
            <TextInput
              value={memberName}
              onChangeText={setMemberName}
              placeholder="例: 藤乃さや"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 ml-11 mb-4"
            />

            {/* カラー選択 */}
            <Text className="text-sm text-gray-700 mb-2 ml-11">推しカラー</Text>
            <View className="flex-row flex-wrap gap-3 ml-11">
              {colors.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  onPress={() => setSelectedMemberColor(color.value)}
                  className="items-center"
                >
                  <View
                    style={{ backgroundColor: color.value }}
                    className={`w-12 h-12 rounded-full ${
                      selectedMemberColor === color.value
                        ? "border-4 border-blue-500"
                        : "border-2 border-gray-300"
                    }`}
                  />
                  <Text className="text-xs text-gray-600 mt-1">
                    {color.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ステップ3: 券種（自動） */}
          <View className="mb-8">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-gray-400 items-center justify-center mr-3">
                <Text className="text-white font-bold">3</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900">
                券種（自動登録）
              </Text>
            </View>
            <Text className="text-sm text-gray-600 mb-3 ml-11">
              以下の券種が自動で追加されます（後で編集可能）
            </Text>
            <View className="ml-11 bg-gray-50 rounded-xl p-4">
              {defaultTickets.map((ticket) => (
                <View
                  key={ticket.name}
                  className="flex-row justify-between py-2"
                >
                  <Text className="text-gray-900">{ticket.name}</Text>
                  <Text className="text-gray-600">
                    ¥{ticket.price.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 完了ボタン */}
          <TouchableOpacity
            onPress={handleComplete}
            className="bg-blue-500 rounded-xl py-4 items-center mt-4"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-lg">
              セットアップ完了
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
