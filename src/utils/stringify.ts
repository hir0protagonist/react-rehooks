export function stringify<T>(value: T) {
    return JSON.stringify(value);
}

export function parse<T>(value: string): T {
    return JSON.parse(value) as T;
}
