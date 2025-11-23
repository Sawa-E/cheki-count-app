/**
 * 今日の日付を YYYY-MM-DD 形式で取得
 */
export const getToday = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Date を YYYY-MM-DD に変換
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD を Date に変換
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString + "T00:00:00");
};

/**
 * 指定月の日数を取得
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * 指定月の1日の曜日を取得（0=日曜）
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month - 1, 1).getDay();
};

/**
 * 月の全日付配列を生成
 */
export const getMonthDates = (year: number, month: number): string[] => {
  const daysInMonth = getDaysInMonth(year, month);
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString().padStart(2, "0");
    const m = month.toString().padStart(2, "0");
    return `${year}-${m}-${day}`;
  });
};
