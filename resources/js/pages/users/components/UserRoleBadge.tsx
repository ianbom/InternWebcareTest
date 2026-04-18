import type { AdminUserRole } from '@/types';

const ROLE_CLASSES: Record<AdminUserRole, string> = {
    admin: 'bg-indigo-50 text-indigo-700',
    candidate: 'bg-emerald-50 text-emerald-700',
};

const ROLE_LABELS: Record<AdminUserRole, string> = {
    admin: 'Admin',
    candidate: 'Candidate',
};

type UserRoleBadgeProps = {
    role: AdminUserRole;
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${ROLE_CLASSES[role]}`}
        >
            {ROLE_LABELS[role]}
        </span>
    );
}
