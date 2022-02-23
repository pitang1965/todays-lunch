function zeroPad(i: number) {
  return i < 10 ? '0' + i : i;
}

export function getDayText(index: number) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[index];
}

export function getStringFromDate(date: Date, withDayKanji = false) {
  const YYYY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  const hh = date.getHours();
  const mm = date.getMinutes();
  const day = withDayKanji ? ` (${getDayText(date.getDay())})` : '';
  return (`${YYYY}-${zeroPad(MM)}-${zeroPad(DD)} ${zeroPad(hh)}:${zeroPad(mm)}${day}`);
}