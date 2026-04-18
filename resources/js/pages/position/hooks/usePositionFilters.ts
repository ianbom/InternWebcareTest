import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { index as positionsIndex } from '@/routes/positions';
import type { PositionFilters } from '@/types';

function cleanQuery(filters: PositionFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ''),
    );
}

export function usePositionFilters(filters: PositionFilters) {
    const [draftFilters, setDraftFilters] = useState<PositionFilters>(filters);

    const applyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            positionsIndex.url({ query: cleanQuery(draftFilters) }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const resetFilters = () => {
        const nextFilters: PositionFilters = {
            search: '',
            is_active: '',
            sort: 'created_at_desc',
        };

        setDraftFilters(nextFilters);
        router.get(positionsIndex.url(), {}, { preserveScroll: true });
    };

    return {
        draftFilters,
        setDraftFilters,
        applyFilters,
        resetFilters,
    };
}
