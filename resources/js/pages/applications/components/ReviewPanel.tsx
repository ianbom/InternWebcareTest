import type { InertiaFormProps } from '@inertiajs/react';
import { CheckCircle2, MessageSquareText, Save } from 'lucide-react';
import type { AdminReviewStatus } from '@/types';
import type { ReviewFormData } from '../types';
import { REVIEW_STATUSES, STATUS_LABELS } from '../utils/application-format';

type ReviewPanelProps = {
    data: ReviewFormData;
    errors: InertiaFormProps<ReviewFormData>['errors'];
    processing: boolean;
    setData: InertiaFormProps<ReviewFormData>['setData'];
};

export function ReviewPanel({
    data,
    errors,
    processing,
    setData,
}: ReviewPanelProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1D449C]">
                <MessageSquareText className="size-5" />
                <h2 className="text-xl font-black text-[#102B5C]">
                    Review Panel
                </h2>
            </div>

            <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B7894]">
                    Final status
                </span>
                <select
                    value={data.status}
                    onChange={(event) =>
                        setData('status', event.target.value as AdminReviewStatus)
                    }
                    className="mt-2 h-11 w-full rounded-2xl border border-[#DCE3F2] bg-[#F7F9FD] px-3 text-sm font-bold text-[#102B5C] outline-none focus:border-[#3D72D1]"
                >
                    {REVIEW_STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>
                {errors.status && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">
                        {errors.status}
                    </p>
                )}
            </label>

            <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6B7894]">
                    Admin notes
                </span>
                <textarea
                    rows={8}
                    value={data.admin_notes}
                    onChange={(event) => setData('admin_notes', event.target.value)}
                    placeholder="Catatan internal untuk keputusan akhir..."
                    className="mt-2 w-full rounded-2xl border border-[#DCE3F2] bg-[#F7F9FD] px-3 py-2 text-sm leading-6 text-[#102B5C] outline-none focus:border-[#3D72D1]"
                />
            </label>

            <button
                type="submit"
                disabled={processing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1D449C] px-5 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(29,68,156,0.25)] transition hover:bg-[#17377E] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {processing ? (
                    'Saving...'
                ) : (
                    <>
                        <Save className="size-4" />
                        Save Review
                    </>
                )}
            </button>

            <div className="rounded-2xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">
                <CheckCircle2 className="mb-2 size-4" />
                Saving sets reviewer and review timestamp. Auto score remains
                unchanged.
            </div>
        </div>
    );
}
