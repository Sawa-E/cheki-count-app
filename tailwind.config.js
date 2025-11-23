/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // アプリ専用カラー
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6", // メイン
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        accent: {
          pink: "#FCE4EC",
          blue: "#E3F2FD",
          yellow: "#FFF9C4",
          green: "#E8F5E9",
          purple: "#F3E5F5",
        },
      },
      fontFamily: {
        // 後でカスタムフォント追加可能
      },
    },
  },
  plugins: [],
};
