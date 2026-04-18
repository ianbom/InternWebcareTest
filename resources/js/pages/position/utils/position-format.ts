export function stripHtml(value: string | null): string {
    if (!value) {
        return '';
    }

    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
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

export function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Prev')
        .replace('Next &raquo;', 'Next')
        .replace('&laquo;', '')
        .replace('&raquo;', '')
        .trim();
}
