export const TAB_LOCK_TTL_MS = 8_000;
export const TAB_LOCK_HEARTBEAT_MS = 2_000;

export interface AssessmentTabLock {
    tabId: string;
    updatedAt: number;
}

export function secondsToDisplay(seconds: number): string {
    const m = Math.floor(Math.max(0, seconds) / 60)
        .toString()
        .padStart(2, '0');
    const s = (Math.max(0, seconds) % 60).toString().padStart(2, '0');

    return `${m}:${s}`;
}

export function labelOf(idx: number): string {
    return String.fromCharCode(65 + idx);
}

export function getCsrfToken(): string {
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    return token ?? '';
}

export function shouldBlockShortcut(event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase();
    const withModifier = event.ctrlKey || event.metaKey;

    return (
        key === 'f12' ||
        key === 'printscreen' ||
        (withModifier && ['a', 'c', 'p', 's', 'u', 'v', 'x'].includes(key)) ||
        (event.ctrlKey && event.shiftKey && ['c', 'i', 'j'].includes(key))
    );
}

export function isRefreshShortcut(event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase();

    return key === 'f5' || ((event.ctrlKey || event.metaKey) && key === 'r');
}

export function buildTabLockKey(applicationId: number): string {
    return `assessment-tab-lock:${applicationId}`;
}

export function createTabId(): string {
    return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function readTabLock(lockKey: string): AssessmentTabLock | null {
    try {
        const raw = localStorage.getItem(lockKey);

        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<AssessmentTabLock>;

        if (
            typeof parsed.tabId !== 'string' ||
            typeof parsed.updatedAt !== 'number'
        ) {
            return null;
        }

        return {
            tabId: parsed.tabId,
            updatedAt: parsed.updatedAt,
        };
    } catch {
        return null;
    }
}

export function writeTabLock(
    lockKey: string,
    lock: AssessmentTabLock,
): void {
    localStorage.setItem(lockKey, JSON.stringify(lock));
}
