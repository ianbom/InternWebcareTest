import type { LucideIcon } from 'lucide-react';

export interface CandidatePosition {
    id: number;
    title: string;
    description: string | null;
    employment_type?: string;
    work_type?: string;
    work_location?: string;
    work_hours?: string;
    duration?: string;
    quota?: string;
    requirements?: string[];
    benefits?: string[];
    selection_flow?: string[];
}

export interface CandidatePositionProps {
    positions: CandidatePosition[] | { data?: CandidatePosition[] } | null;
    hasAppliedPosition: boolean;
}

export interface IconScheme {
    bg: string;
}

export interface PositionStatItem {
    Icon: LucideIcon;
    label: string;
    value: string;
    iconCls: string;
    bgCls: string;
    bdCls: string;
}
