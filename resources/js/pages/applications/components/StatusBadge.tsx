import type { AdminApplicationStatus } from '@/types';
import { STATUS_CLASSES, STATUS_LABELS } from '../utils/application-format';

type StatusBadgeProps = {
    status: AdminApplicationStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASSES[status]}`}>
            {STATUS_LABELS[status]}
        </span>
    );
}
