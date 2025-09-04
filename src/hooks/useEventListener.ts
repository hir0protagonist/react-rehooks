import { useEffect, useRef } from 'react';

type EventElement = HTMLElement | Document | Window;
type EventOptopns = AddEventListenerOptions | boolean;
type EventTarget<T extends EventElement> = T | React.RefObject<T>;

function resolveTarget<T extends EventElement>(target?: EventTarget<T>): T | undefined {
    if (!target) return void 0;
    if ('current' in target) return target.current ?? void 0;
    return target;
}

export function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (e: WindowEventMap[K]) => void,
    element?: EventTarget<Window>,
    options?: EventOptopns
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (e: DocumentEventMap[K]) => void,
    element: EventTarget<Document>,
    options?: EventOptopns
): void;
export function useEventListener<K extends keyof HTMLElementEventMap>(
    eventName: K,
    handler: (e: HTMLElementEventMap[K]) => void,
    element: EventTarget<HTMLElement>,
    options?: EventOptopns
): void;
export function useEventListener<T = Event>(eventName: string, handler: (e: T) => void, element: EventTarget<EventElement>, options?: EventOptopns): void;

export function useEventListener(eventName: string, handler: (e: Event) => void, element?: EventTarget<EventElement>, options?: EventOptopns) {
    const handlerRef = useRef(handler);
    const cleanupRef = useRef<() => void>(() => {});

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        const target = resolveTarget(element) ?? (typeof window !== 'undefined' ? window : void 0);
        if (!target?.addEventListener) return;

        const listener = (e: Event) => handlerRef.current(e);
        target.addEventListener(eventName, listener, options);

        const cleanup = () => target.removeEventListener(eventName, listener, options);
        cleanupRef.current = cleanup;

        return cleanup;
    }, [eventName, element, options]);

    return cleanupRef.current;
}
