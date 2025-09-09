import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useSessionStorage } from '../useStorage';

describe('useLocalStorage hook', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    it('should init with default value', () => {
        const [value] = renderHook(() => useLocalStorage('counter', 1)).result.current;
        expect(value).toBe(1);
    });

    it('should read and write values', () => {
        const { result } = renderHook(() => useLocalStorage('counter', 1));
        act(() => result.current[1](2));
        expect(result.current[0]).toBe(2);
        expect(localStorage.getItem('counter')).toBe(JSON.stringify(2));
    });

    it('should remove value and reset to initial', () => {
        const { result } = renderHook(() => useLocalStorage('counter', 1));
        act(() => result.current[1](10));
        act(() => result.current[2]());
        expect(result.current[0]).toBe(1);
        expect(localStorage.getItem('counter')).toBeNull();
    });

    it('should work with sessionStorage alias', () => {
        const { result } = renderHook(() => useSessionStorage<string>('token', null));
        act(() => result.current[1]('abc-123'));
        expect(result.current[0]).toBe('abc-123');
        expect(sessionStorage.getItem('token')).toBe(JSON.stringify('abc-123'));
        act(() => {
            result.current[2]();
        });
        expect(result.current[0]).toBeNull();
        expect(sessionStorage.getItem('token')).toBeNull();
    });

    it('should accept function to set a value', () => {
        const { result } = renderHook(() => useLocalStorage('count', 0));
        act(() => result.current[1]((prev) => prev + 1));
        expect(result.current[0]).toBe(1);
        expect(localStorage.getItem('count')).toBe(JSON.stringify(1));
    });
});
