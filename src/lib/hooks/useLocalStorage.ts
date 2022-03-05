import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key: string, initialValue: string = ''):[string, (value: string)=>void] {
  // localStorageの値の状態
  // 初期値の設定は一回だけおこなわれる。
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    setStoredValue(JSON.parse(item as string));
  }, [initialValue, key, setStoredValue]);

  // useStateのsetter関数を返す。
  // この関数はlocalStorageに新しい値を設定する。
  const setValue = useCallback((value: string) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [storedValue, setValue];
}
