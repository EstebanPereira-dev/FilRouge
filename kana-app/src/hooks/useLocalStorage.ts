import { useState } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue: SetValue<T> = (value) => {
        try {
            const next = value instanceof Function ? value(storedValue) : value;
            setStoredValue(next);
            localStorage.setItem(key, JSON.stringify(next));
        } catch {
            console.error('localStorage error:', key);
        }
    };

    return [storedValue, setValue];
}