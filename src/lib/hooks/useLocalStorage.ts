import { useState, useEffect } from 'react';


export function useLocalStorage(key: string, initialValue: string = ''): [string, (value: string) => void] {
  // localStorageの値の状態
  // 初期値の設定は一回だけおこなわれる。
  const [storedValue, setStoredValue] = useState(initialValue);
  useEffect(() => {
    try {
      let item = undefined;
      item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(error);
    }
  }, [initialValue, key]);

  // useStateのsetter関数を返す。
  // この関数はlocalStorageに新しい値を設定する。
  function setValue(value: string): void {
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
