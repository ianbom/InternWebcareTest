import { Briefcase } from 'lucide-react';
import type { CandidatePosition, IconScheme } from '../../types';
import { DEFAULT_POSITION_META } from '../../utils/position-constants';
import { stripHtml } from '../../utils/position-format';

interface PositionCardProps {
    iconScheme: IconScheme;
    position: CandidatePosition;
    onSelect: (position: CandidatePosition) => void;
}

export function PositionCard({
    iconScheme,
    onSelect,
    position,
}: PositionCardProps) {
    return (
        <div className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-xs font-medium text-gray-400">
                        WebcareIntern
                    </p>
                    <h3 className="text-lg leading-tight font-bold text-gray-800 transition-colors duration-200 group-hover:text-primary">
                        {position.title}
                    </h3>
                </div>
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconScheme.bg}`}
                >
                    <Briefcase className="h-6 w-6 text-white" />
                </div>
            </div>

            <p className="text-sm font-semibold text-primary">
                {position.employment_type ?? DEFAULT_POSITION_META.employmentType}
            </p>

            <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                {stripHtml(position.description) ||
                    'Tidak ada deskripsi tersedia untuk posisi ini.'}
            </p>

            <div className="mt-auto grid grid-cols-2 gap-2 pt-1 text-xs font-semibold text-gray-500">
                <span className="rounded-full bg-purple-50 px-3 py-1.5 text-center text-primary uppercase">
                    {position.work_type ?? DEFAULT_POSITION_META.workType}
                </span>
                <span className="rounded-full bg-gray-50 px-3 py-1.5 text-center">
                    {position.duration ?? DEFAULT_POSITION_META.duration}
                </span>
            </div>

            <button
                type="button"
                onClick={() => onSelect(position)}
                className="mt-1 block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
                Daftar Sekarang
            </button>
        </div>
    );
}
