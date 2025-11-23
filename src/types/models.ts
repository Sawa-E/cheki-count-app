// ========================================
// グループ
// ========================================
export interface Group {
  id: string;
  name: string; // 例: "IMMM", "箱A"
  color: string; // 例: "#E3F2FD"
  sortOrder: number; // 表示順
  createdAt: string;
}

// ========================================
// メンバー（推し）
// ========================================
export interface Member {
  id: string;
  groupId: string; // 所属グループID
  name: string; // 例: "藤乃さや"
  displayName: string; // 表示名（省略形も可）
  color: string; // 推しカラー 例: "#FCE4EC"
  sortOrder: number; // 表示順
  isFavorite: boolean; // よく使う推しフラグ
  createdAt: string;
}

// ========================================
// 券種
// ========================================
export type TicketCategory = "cheki" | "shamekai" | "video" | "goods" | "other";

export interface TicketType {
  id: string;
  groupId?: string; // グループごとに券種が異なる（オプショナルに変更）
  name: string; // 例: "チェキ券"
  category: TicketCategory;
  price: number; // defaultPrice → price に変更（シンプル化）
  color: string; // タイル背景色
  icon?: string; // アイコン（絵文字可）
  sortOrder: number;
  isActive: boolean; // 表示ON/OFF
  createdAt: string;
}

// ========================================
// イベント（後から分類用）
// ========================================
export interface Event {
  id: string;
  date: string; // YYYY-MM-DD
  name: string; // 例: "昼公演", "夜公演"
  startTime?: string; // HH:MM（任意）
  venue?: string; // 会場名（任意）
  memo?: string;
  createdAt: string;
}

// ========================================
// カウント記録（メインデータ）
// ========================================
export interface CountRecord {
  id: string;
  date: string; // YYYY-MM-DD（記録日）
  timestamp?: string; // ISO 8601（記録時刻）- オプショナルに変更

  memberId: string; // 推しID
  ticketTypeId: string; // 券種ID

  count: number; // 枚数
  pricePerItem?: number; // この時の単価（デフォルトと異なる場合）- オプショナルに変更
  totalPrice?: number; // 合計金額 = count × pricePerItem - オプショナルに変更

  eventId?: string; // イベントID（後から分類）
  memo?: string; // メモ（任意）

  createdAt: string;
  updatedAt?: string; // オプショナルに変更
}

// ========================================
// 日別メモ
// ========================================
export interface Memo {
  id: string;
  date: string; // YYYY-MM-DD
  content: string; // メモ内容
  createdAt: string;
}

// ========================================
// 日次サマリー（集計用）
// ========================================
export interface DailySummary {
  date: string;
  totalCount: number;
  totalPrice: number;
  memberCounts: Record<string, number>; // memberId: count
  eventIds: string[];
}

// ========================================
// 月次サマリー（集計用）
// ========================================
export interface MonthlySummary {
  year: number;
  month: number;
  totalCount: number;
  totalPrice: number;
  dailySummaries: Record<string, DailySummary>; // date: summary
  topMembers: { memberId: string; count: number; price: number }[];
}
