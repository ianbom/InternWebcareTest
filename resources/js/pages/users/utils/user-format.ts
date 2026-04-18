import type {
    AdminUserFilters,
    AdminUserFormData,
    AdminUserPasswordFormData,
} from '@/types';

export const EMPTY_USER_FORM: AdminUserFormData = {
    name: '',
    email: '',
    phone: '',
    role: 'candidate',
    password: '',
    password_confirmation: '',
};

export const EMPTY_PASSWORD_FORM: AdminUserPasswordFormData = {
    password: '',
    password_confirmation: '',
};

export const DEFAULT_USER_FILTERS: AdminUserFilters = {
    search: '',
    role: '',
    has_cv: '',
    sort: 'created_at_desc',
};

export function cleanQuery(filters: AdminUserFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ''),
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

export function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Prev')
        .replace('Next &raquo;', 'Next')
        .replace('&laquo;', '')
        .replace('&raquo;', '')
        .trim();
}
