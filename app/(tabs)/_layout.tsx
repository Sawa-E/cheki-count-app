import { Tabs } from "expo-router";
import { Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // 下部の安全領域を考慮した高さ
  const tabBarHeight = Platform.OS === "ios" ? 70 + insets.bottom : 70;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: tabBarHeight,
          paddingTop: 12,
          paddingBottom: Platform.OS === "ios" ? insets.bottom + 4 : 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 8, // さらに上に
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "記録",
          tabBarIcon: ({ color }) => (
            <View className="w-7 h-7 items-center justify-center">
              <Text style={{ color, fontSize: 24 }}>📝</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "カレンダー",
          tabBarIcon: ({ color }) => (
            <View className="w-7 h-7 items-center justify-center">
              <Text style={{ color, fontSize: 24 }}>📊</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "設定",
          tabBarIcon: ({ color }) => (
            <View className="w-7 h-7 items-center justify-center">
              <Text style={{ color, fontSize: 24 }}>⚙️</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
