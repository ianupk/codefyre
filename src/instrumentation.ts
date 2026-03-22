/**
 * Next.js Instrumentation Hook
 *
 * Fixes Node.js v22+/v25+ broken `localStorage` global.
 * Node v22+ exposes a global `localStorage` object, but without
 * `--localstorage-file=<path>`, its methods (getItem, setItem, etc.)
 * are undefined, causing "localStorage.getItem is not a function" errors
 * during SSR.
 *
 * This replaces the broken global with a no-op in-memory stub so that
 * any code referencing `localStorage` during SSR won't crash.
 */
export async function register() {
    if (typeof window === "undefined" && typeof globalThis.localStorage !== "undefined") {
        const store = new Map<string, string>();
        const stub: Storage = {
            getItem: (key: string) => store.get(key) ?? null,
            setItem: (key: string, value: string) => store.set(key, String(value)),
            removeItem: (key: string) => {
                store.delete(key);
            },
            clear: () => store.clear(),
            get length() {
                return store.size;
            },
            key: (index: number) => [...store.keys()][index] ?? null,
        };
        Object.defineProperty(globalThis, "localStorage", { value: stub, writable: true });
    }
}

