import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { index } from '@/routes/users';
import type { AdminUserFilters } from '@/types';
import { cleanQuery, DEFAULT_USER_FILTERS } from '../utils/user-format';

export function useUserFilters(filters: AdminUserFilters) {
    const [draftFilters, setDraftFilters] = useState<AdminUserFilters>(filters);

    const applyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            index.url({ query: cleanQuery(draftFilters) }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const resetFilters = () => {
        setDraftFilters(DEFAULT_USER_FILTERS);
        router.get(index.url(), {}, { preserveScroll: true });
    };

    return {
        applyFilters,
        draftFilters,
        resetFilters,
        setDraftFilters,
    };
}
