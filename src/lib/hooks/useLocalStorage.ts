import { useState } from 'react';

export function useLocalStorage(key: string, initialValue: string = '') {
  // localStorageの値の状態
  // 初期値の設定は一回だけおこなわれる。
  const [storedValue, setStoredValue] = useState(() => {
    try {
      let item = undefined;
      if (typeof window !== 'undefined') {
        item = window.localStorage.getItem(key);
      } else {
        console.log('#1: window is undefined.');
      }
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // useStateのsetter関数を返す。
  // この関数はlocalStorageに新しい値を設定する。
  function setValue(value: string) {
    try {
      if (typeof window !== 'undefined') {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } else {
        console.log('#2: window is undefined.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return [storedValue, setValue];
}
