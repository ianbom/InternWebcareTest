export function cleanQuery<T extends Record<string, unknown>>(
    filters: T,
): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters)
            .filter(([, value]) => value !== '' && value !== null && value !== undefined)
            .map(([key, value]) => [key, String(value)]),
    );
}

export function formatDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

export function formatDateTime(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Prev')
        .replace('Next &raquo;', 'Next');
}
