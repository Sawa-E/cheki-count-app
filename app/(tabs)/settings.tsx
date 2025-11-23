import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGroupStore } from "../../src/stores/groupStore";
import { useMemberStore } from "../../src/stores/memberStore";
import { useTicketStore } from "../../src/stores/ticketStore";

export default function SettingsScreen() {
  const router = useRouter();

  const groups = useGroupStore((state) => state.getAllGroups());
  const members = useMemberStore((state) => state.getAllMembers());
  const tickets = useTicketStore((state) => state.getAllTickets());

  // データを完全削除
  const handleDeleteAllData = () => {
    Alert.alert(
      "データを削除",
      "すべてのデータを削除しますか？この操作は取り消せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                "group-storage",
                "member-storage",
                "ticket-storage",
                "count-storage",
                "memo-storage",
              ]);
              Alert.alert(
                "完了",
                "すべてのデータを削除しました。アプリを再起動してください。"
              );
            } catch (error) {
              Alert.alert("エラー", "データの削除に失敗しました");
            }
          },
        },
      ]
    );
  };

  // データエクスポート（JSON）
  const handleExportData = async () => {
    try {
      const data = {
        groups,
        members,
        tickets,
        exportDate: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(data, null, 2);
      console.log("=== データエクスポート ===");
      console.log(jsonString);

      Alert.alert(
        "エクスポート完了",
        "データをコンソールに出力しました。\n\n" +
          `グループ: ${groups.length}件\n` +
          `推し: ${members.length}件\n` +
          `券種: ${tickets.length}件`,
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("エラー", "データのエクスポートに失敗しました");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* ヘッダー */}
        <View className="px-4 py-3 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">設定</Text>
        </View>

        <View className="p-4">
          {/* グループ管理 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">
              グループ管理
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/groups")}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-2"
              activeOpacity={0.7}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-900 font-medium">
                    グループを管理
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    登録済み: {groups.length}件
                  </Text>
                </View>
                <Text className="text-gray-400 text-xl">›</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* メンバー管理 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">
              メンバー管理
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/members")}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-2"
              activeOpacity={0.7}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-900 font-medium">推しを管理</Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    登録済み: {members.length}件
                  </Text>
                </View>
                <Text className="text-gray-400 text-xl">›</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* 券種管理 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">
              券種管理
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/tickets")}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-2"
              activeOpacity={0.7}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-900 font-medium">券種を管理</Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    登録済み: {tickets.length}件
                  </Text>
                </View>
                <Text className="text-gray-400 text-xl">›</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* データ管理 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">
              データ管理
            </Text>

            <TouchableOpacity
              onPress={handleExportData}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
              activeOpacity={0.7}
            >
              <Text className="text-gray-900 font-medium">
                データをエクスポート
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                データをコンソールに出力
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteAllData}
              className="bg-white border border-red-200 rounded-xl p-4"
              activeOpacity={0.7}
            >
              <Text className="text-red-600 font-medium">
                すべてのデータを削除
              </Text>
              <Text className="text-sm text-red-400 mt-1">
                この操作は取り消せません
              </Text>
            </TouchableOpacity>
          </View>

          {/* アプリ情報 */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-3">
              アプリ情報
            </Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-600">バージョン</Text>
                <Text className="text-gray-900 font-medium">1.0.0</Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-600">ビルド</Text>
                <Text className="text-gray-900 font-medium">MVP</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
