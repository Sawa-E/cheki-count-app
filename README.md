````
# Cheki Counter App – 開発環境構築メモ

React Native / Expo / NativeWind / Tailwind を使った
チェキカウンターアプリ用の開発環境構築手順メモ。

---

## 使用スタック

- Expo SDK 54
- React Native 0.81
- TypeScript
- Expo Router（`tabs` テンプレート）
- NativeWind v4
- Tailwind CSS v3.4.x（※ v4 は非対応なので NG）
- React Native Reanimated
- react-native-safe-area-context
- react-native-worklets

---

## 0. 前提

- Node.js がインストールされていること
- npm を使用（pnpm / yarn でも可だが、この手順は npm 前提）

---

## 1. プロジェクト作成（Expo Router tabs テンプレート）

```bash
npx create-expo-app cheki-counter-app --template tabs

cd cheki-counter-app
```

````

この時点で一度起動しておく：

```bash
npx expo start
```

タブ画面が表示されれば OK。

---

## 2. 必要パッケージのインストール

### NativeWind / Tailwind / Reanimated / SafeArea / Worklets

```bash
npm install nativewind
npm install -D tailwindcss@^3.4.0
npx expo install react-native-reanimated react-native-safe-area-context react-native-worklets
```

> ⚠ 注意：
> Tailwind CSS v4 は **NativeWind v4 非対応**。
> `tailwindcss@^3.4.0` など **v3 系**を使うこと。

---

## 3. Tailwind 設定（tailwind.config.js）

プロジェクトルートに `tailwind.config.js` を作成し、以下を記述：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## 4. グローバル CSS（global.css）

プロジェクトルートに `global.css` を作成：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 5. Babel 設定（babel.config.js）

`babel.config.js` を以下の内容にする：

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

---

## 6. Metro 設定（metro.config.js）

`metro.config.js` がない場合は：

```bash
npx expo customize metro.config.js
```

生成された `metro.config.js` を以下に書き換える：

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

---

## 7. Expo Router のレイアウトで global.css を読み込む

`app/_layout.tsx` にて `global.css` を import する：

```tsx
import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

---

## 8. NativeWind 型定義（app.d.ts）

プロジェクトルートに `app.d.ts` を作成：

```ts
/// <reference types="nativewind/types" />
```

---

## 9. 動作確認用コンポーネント

`app/index.tsx` を以下のように編集して、Tailwind クラスが効くか確認：

```tsx
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-blue-600">
        Hello NativeWind!!
      </Text>
      <Text className="mt-4 text-base text-gray-500">
        チェキカウンタ環境構築完了 ✌
      </Text>
    </View>
  );
}
```

---

## 10. 起動（キャッシュクリア付き）

```bash
npx expo start -c
```

Expo Go で QR コードを読み取り、
青い大きなテキストとグレーのテキストが表示されれば、
**NativeWind / Tailwind / Expo Router の環境構築は完了。**

---

## トラブルシュートメモ

### ❗ `NativeWind only supports Tailwind CSS v3`

- 原因：`tailwindcss` v4 を入れている
- 対処：

  ```bash
  npm uninstall tailwindcss
  npm install -D tailwindcss@^3.4.0
  ```

  その後、`tailwind.config.js` が v3 形式になっていることを確認。

### ❗ Metro config を読めない / `could not be loaded with Node.js`

- `metro.config.js` に ESModule 構文（`import` / `export default`）を書いていないか確認
- 上記の CommonJS 版：

  ```js
  const { getDefaultConfig } = require("expo/metro-config");
  const { withNativeWind } = require("nativewind/metro");

  const config = getDefaultConfig(__dirname);

  module.exports = withNativeWind(config, { input: "./global.css" });
  ```

  に統一する。

---

```

```
