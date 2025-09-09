import { useState, useEffect, useCallback } from 'react';
import { parse, stringify } from '../utils';

type StorageType = 'local' | 'session';

const getStorage = (type: StorageType): Storage | null => {
    if (typeof window === 'undefined') return null;
    return type === 'local' ? window.localStorage : window.sessionStorage;
};

/**
 * A React hook to persist state in Storage (localStorage or sessionStorage) and keep it synced across tabs.
 *
 * @param key The key under which the value will be stored in storage
 * @param defaultValue The default value to use if key is found in storage
 * @param storageType The type of the storage: (localStorage or sessionStorage) 'local' | 'session'
 *
 */

export function useStorage<T>(key: string, defaultValue: T, storageType?: 'local' | 'session'): readonly [T, (value: T | ((prev: T) => T)) => void, () => void];

export function useStorage<T = unknown>(
    key: string,
    defaultValue: T | null,
    storageType?: 'local' | 'session'
): readonly [T | null, (value: T | ((prev: T | null) => T | null)) => void, () => void];

export function useStorage<T>(key: string, defaultValue: T, storageType: 'local' | 'session' = 'local') {
    const storage = getStorage(storageType);

    const readValue = useCallback((): T => {
        if (!storage) return defaultValue;
        try {
            const item = storage.getItem(key);
            return item ? parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Can't read localStorage key “${key}”:`, error);
            return defaultValue;
        }
    }, [defaultValue]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue = useCallback(
        (value: T | ((prevValue: T) => T)) => {
            try {
                setStoredValue((prevValue) => {
                    const newValue = value instanceof Function ? value(prevValue) : value;
                    if (storage) storage.setItem(key, stringify(newValue));
                    return newValue;
                });
            } catch (error) {
                console.warn(`Can't set localStorage key “${key}”:`, error);
            }
        },
        [key]
    );

    const removeValue = useCallback(() => {
        if (!storage) return;
        try {
            storage.removeItem(key);
            setStoredValue(defaultValue);
        } catch (error) {
            console.warn(`Can't remove localStorage key “${key}”:`, error);
        }
    }, [key, defaultValue]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key) {
                setStoredValue(event.newValue ? parse(event.newValue) : defaultValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, defaultValue]);

    return [storedValue, setValue, removeValue] as const;
}

/**
 * A React hook to persist state in localStorage and keep it synced across tabs.
 *
 * @param key The key under which the value will be stored in localStorage
 * @param defaultValue The default value to use if key is found in localStorage
 */
export function useLocalStorage<T>(key: string, defaultValue: T): readonly [T, (val: T | ((prev: T) => T)) => void, () => void];

export function useLocalStorage<T = unknown>(key: string, defaultValue: T | null): readonly [T | null, (val: T | ((prev: T | null) => T | null)) => void, () => void];

export function useLocalStorage<T>(key: string, defaultValue: T) {
    return useStorage<T>(key, defaultValue, 'local');
}

/**
 * A React hook to persist state in sessionStorage and keep it synced across tabs.
 *
 * @param key The key under which the value will be stored in sessionStorage
 * @param defaultValue The default value to use if key is found in sessionStorage
 */
export function useSessionStorage<T>(key: string, defaultValue: T): readonly [T, (val: T | ((prev: T) => T)) => void, () => void];

export function useSessionStorage<T = unknown>(key: string, defaultValue?: T | null): readonly [T | null, (val: T | ((prev: T | null) => T | null)) => void, () => void];

export function useSessionStorage<T>(key: string, defaultValue: T) {
    return useStorage<T>(key, defaultValue, 'session');
}

