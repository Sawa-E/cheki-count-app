import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useMemberStore } from "../src/stores/memberStore";

export default function Index() {
  const router = useRouter();
  const members = useMemberStore((state) => state.members);

  useEffect(() => {
    const init = async () => {
      // 🚨 デバッグ用: 古いデータを削除
      // 本番リリース時はこの部分を削除してください
      await AsyncStorage.multiRemove([
        "group-storage",
        "member-storage",
        "ticket-storage",
        "count-storage",
        "memo-storage",
      ]);

      console.log("✅ ストレージをクリアしました");

      // 少し待ってから判定
      setTimeout(() => {
        if (members.length === 0) {
          console.log("→ セットアップ画面へ");
          router.replace("/setup");
        } else {
          console.log("→ メイン画面へ");
          router.replace("/(tabs)");
        }
      }, 200);
    };

    init();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}
