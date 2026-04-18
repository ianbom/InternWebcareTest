import { CalendarClock, Clock3, Layers3, MapPin } from 'lucide-react';
import type {
    CandidatePosition,
    CandidatePositionProps,
    PositionStatItem,
} from '../types';
import { DEFAULT_POSITION_META } from './position-constants';

export function normalizePositions(
    positions: CandidatePositionProps['positions'],
): CandidatePosition[] {
    if (Array.isArray(positions)) {
        return positions;
    }

    if (Array.isArray(positions?.data)) {
        return positions.data;
    }

    return [];
}

export function fallbackList(
    value: string[] | undefined,
    fallback: string[],
): string[] {
    return value && value.length > 0 ? value : fallback;
}

export function buildPositionStats(position: CandidatePosition): PositionStatItem[] {
    return [
        {
            Icon: Clock3,
            label: 'Jam Kerja',
            value: position.work_hours ?? DEFAULT_POSITION_META.workHours,
            iconCls: 'text-[#0E3F97]',
            bgCls: 'bg-[#E8EEF9]',
            bdCls: 'border-blue-100',
        },
        {
            Icon: MapPin,
            label: 'Lokasi',
            value: position.work_location ?? DEFAULT_POSITION_META.workLocation,
            iconCls: 'text-emerald-600',
            bgCls: 'bg-emerald-50',
            bdCls: 'border-emerald-100',
        },
        {
            Icon: Layers3,
            label: 'Model Kerja',
            value: position.work_type ?? DEFAULT_POSITION_META.workType,
            iconCls: 'text-amber-600',
            bgCls: 'bg-amber-50',
            bdCls: 'border-amber-100',
        },
        {
            Icon: CalendarClock,
            label: 'Durasi',
            value: position.duration ?? DEFAULT_POSITION_META.duration,
            iconCls: 'text-purple-600',
            bgCls: 'bg-purple-50',
            bdCls: 'border-purple-100',
        },
    ];
}
