import { getDayText, zeroPad } from '../lib/timeUtile';

export type LunchDateData = {
  year: number;
  month: number;
  date: number;
  day: string;
};

export function currentDate() {
  if (process.env.NEXT_PUBLIC_TEST_MODE === 'true' && process.env.NEXT_PUBLIC_TEST_DATE !=='') {
    return (new Date(process.env.NEXT_PUBLIC_TEST_DATE as string));
  } else {
    return new Date();
  }
}

// 13時20分前なら本日、それ以外は翌日を返す
export function getNextLunchDateString(): [string, string] {
  const now = currentDate();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();

  console.log(`現在時刻：${year}-${zeroPad(month)}-${zeroPad(date)}(${getDayText(now.getDay())}) ${hour}:${minute}`);

  if (hour <= 13 || (hour === 13 && minute <= 20)) {
    const dayOfWeek = now.getDay();
    const day = getDayText(dayOfWeek);

    const dateString = `${year}-${zeroPad(month)}-${zeroPad(date)}(${day})`;
    return [dateString, day];
  } else {
    const addtion_time = 1000 * 60 * 60 * 24; // 1日
    const tommorrow = new Date();
    tommorrow.setMilliseconds(now.getMilliseconds() + addtion_time);
    const year = tommorrow.getFullYear();
    const month = tommorrow.getMonth() + 1;
    const date = tommorrow.getDate();
    const dayOfWeek = tommorrow.getDay();
    const day = getDayText(dayOfWeek);

    const dateString = `${year}-${zeroPad(month)}-${zeroPad(date)}(${day})`;
    return [dateString, day];
  }
}

// 現在、注文可能かどうか。10:00～14:59は注文できない
export function canOrderNow() {
  const now = currentDate();
  const hour = now.getHours();
  console.log('★今の時間', hour)
  return (hour < 10 || 15 <= hour);
}