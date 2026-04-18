import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { cleanQuery } from '@/pages/shared/utils';
import { index } from '@/routes/applications';
import type { AdminApplicationFilters } from '@/types';

const DEFAULT_FILTERS: AdminApplicationFilters = {
    search: '',
    status: '',
    position_id: '',
    applied_from: '',
    applied_to: '',
    submitted_from: '',
    submitted_to: '',
    min_score: '',
    max_score: '',
    sort: 'created_at_desc',
};

export function useApplicationFilters(filters: AdminApplicationFilters) {
    const [draftFilters, setDraftFilters] =
        useState<AdminApplicationFilters>(filters);

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
        setDraftFilters(DEFAULT_FILTERS);
        router.get(index.url(), {}, { preserveScroll: true });
    };

    return {
        applyFilters,
        draftFilters,
        resetFilters,
        setDraftFilters,
    };
}
