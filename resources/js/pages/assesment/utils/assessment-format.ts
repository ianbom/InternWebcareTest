import { cleanQuery, formatDate, formatDateTime, paginationLabel } from '@/pages/shared/utils';
import type { AssessmentFilters, AssessmentFormData } from '@/types';

export { cleanQuery, formatDate, formatDateTime, paginationLabel };

export const EMPTY_ASSESSMENT_FORM: AssessmentFormData = {
    position_id: '',
    title: '',
    duration_minutes: '60',
};

export const DEFAULT_ASSESSMENT_FILTERS: AssessmentFilters = {
    search: '',
    position_id: '',
    duration_min: '',
    duration_max: '',
    sort: 'created_at_desc',
};
