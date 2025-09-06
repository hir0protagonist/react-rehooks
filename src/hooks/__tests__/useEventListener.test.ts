import { renderHook, act } from '@testing-library/react';
import { useEventListener } from '../useEventListener';

describe('useEventListener', () => {
    it('attaches and detaches window event listener', () => {
        const handler = jest.fn();
        const { unmount } = renderHook(() => useEventListener('resize', handler, window));

        act(() => window.dispatchEvent(new Event('resize')));

        expect(handler).toHaveBeenCalledTimes(1);

        unmount();
        act(() => window.dispatchEvent(new Event('resize')));

        expect(handler).toHaveBeenCalledTimes(1);
    });
});
