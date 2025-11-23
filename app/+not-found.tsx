import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "ページが見つかりません" }} />
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-2">404</Text>
        <Text className="text-gray-600 mb-4">ページが見つかりません</Text>
        <Link href="/" className="text-indigo-600 font-medium">
          ホームに戻る
        </Link>
      </View>
    </>
  );
}
