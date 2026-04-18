import { AlertTriangle } from 'lucide-react';
import { formatDateTime } from '@/pages/shared/utils';
import type { AdminAssessmentWarning } from '@/types';

type WarningsPanelProps = {
    warnings: AdminAssessmentWarning[];
};

export function WarningsPanel({ warnings }: WarningsPanelProps) {
    if (warnings.length === 0) {
return null;
}

    return (
        <section className="rounded-[24px] border border-[#DCE3F2] bg-white p-5 shadow-[0_16px_50px_rgba(16,43,92,0.08)]">
            <div className="mb-4 flex items-center gap-2 text-rose-600">
                <AlertTriangle className="size-5" />
                <h2 className="text-xl font-black text-[#102B5C]">
                    Assessment Warnings
                    <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-sm font-bold text-rose-600">
                        {warnings.length}
                    </span>
                </h2>
            </div>
            <div className="space-y-3">
                {warnings.map((warning) => (
                    <div
                        key={warning.id}
                        className="rounded-2xl border border-rose-100 bg-rose-50 p-4"
                    >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="font-bold text-rose-900 capitalize">
                                    {warning.action?.replace(/_/g, ' ')}
                                </p>
                                <p className="mt-1 text-sm text-rose-700">
                                    {warning.description ?? '-'}
                                </p>
                            </div>
                            <span className="whitespace-nowrap text-xs font-semibold text-rose-500">
                                {formatDateTime(warning.created_at)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
