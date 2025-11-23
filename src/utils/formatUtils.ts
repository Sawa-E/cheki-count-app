/**
 * 金額をフォーマット
 * @example formatCurrency(1000) => "¥1,000"
 */
export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString("ja-JP")}`;
};

/**
 * 枚数をフォーマット
 * @example formatCount(5) => "5枚"
 */
export const formatCount = (count: number): string => {
  return `${count}枚`;
};

/**
 * 金額を短縮表示
 * @example formatCurrencyShort(3000) => "¥3k"
 */
export const formatCurrencyShort = (amount: number): string => {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  if (amount >= 1000) {
    return `¥${(amount / 1000).toFixed(0)}k`;
  }
  return `¥${amount}`;
};
