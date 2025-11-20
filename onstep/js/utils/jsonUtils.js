export function safeParse(data) {
    try {
        return JSON.parse(data);
    } catch (_e) {
        return undefined;
    }
}

export function safeStringify(data) {
    try {
        return JSON.stringify(data);
    } catch (_e) {
        return undefined;
    }
}
