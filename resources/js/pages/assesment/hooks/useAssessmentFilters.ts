import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { list as assessmentsList } from '@/routes/assessments';
import type { AssessmentFilters } from '@/types';
import { cleanQuery, DEFAULT_ASSESSMENT_FILTERS } from '../utils/assessment-format';

export function useAssessmentFilters(filters: AssessmentFilters) {
    const [draftFilters, setDraftFilters] = useState<AssessmentFilters>(filters);

    const applyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            assessmentsList.url({ query: cleanQuery(draftFilters) }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const resetFilters = () => {
        setDraftFilters(DEFAULT_ASSESSMENT_FILTERS);
        router.get(assessmentsList.url(), {}, { preserveScroll: true });
    };

    return {
        applyFilters,
        draftFilters,
        resetFilters,
        setDraftFilters,
    };
}
