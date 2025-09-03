import { useEffect, useRef } from 'react';

type EventElement = HTMLElement | Document | Window;
type EventOptopns = AddEventListenerOptions | boolean;

export function useEventListener<K extends keyof WindowEventMap>(eventName: K, handler: (e: WindowEventMap[K]) => void, element?: Window, options?: EventOptopns): void;
export function useEventListener<K extends keyof DocumentEventMap>(eventName: K, handler: (e: DocumentEventMap[K]) => void, element: Document, options?: EventOptopns): void;
export function useEventListener<K extends keyof HTMLElementEventMap>(
    eventName: K,
    handler: (e: HTMLElementEventMap[K]) => void,
    element: HTMLElement,
    options?: EventOptopns
): void;
export function useEventListener<T = Event>(eventName: string, handler: (e: T) => void, element: EventElement, options?: EventOptopns): void;

export function useEventListener(eventName: string, handler: (e: Event) => void, element: EventElement = window, options?: EventOptopns) {
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        if (!element?.addEventListener) return;

        const listener = (e: Event) => handlerRef.current(e);
        element.addEventListener(eventName, listener, options);

        return () => element.removeEventListener(eventName, listener, options);
    }, [eventName, element]);
}
