import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Briefcase, FileText, X } from 'lucide-react';
import HTMLContent from '@/components/HTMLContent';
import { edit as editProfileRoute } from '@/routes/profile';
import type { CandidatePosition } from '../../types';
import {
    DEFAULT_POSITION_META,
    DEFAULT_SELECTION_FLOW,
} from '../../utils/position-constants';
import {
    buildPositionStats,
    fallbackList,
} from '../../utils/position-normalize';
import { PositionStatsGrid } from './PositionStatsGrid';
import { SelectionFlowStepper } from './SelectionFlowStepper';

interface PositionDetailModalProps {
    applyingPositionId: number | null;
    hasAppliedPosition: boolean;
    isProfileComplete: boolean;
    onApply: (positionId: number) => void;
    onClose: () => void;
    position: CandidatePosition | null;
}

export function PositionDetailModal({
    applyingPositionId,
    hasAppliedPosition,
    isProfileComplete,
    onApply,
    onClose,
    position,
}: PositionDetailModalProps) {
    const isApplyingSelected =
        position !== null && applyingPositionId === position.id;
    const selectedFlow = position
        ? fallbackList(position.selection_flow, DEFAULT_SELECTION_FLOW)
        : [];
    const statItems = position ? buildPositionStats(position) : [];

    return (
        <AnimatePresence>
            {position && (
                <motion.div
                    key="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F1E46]/50 p-0 backdrop-blur-md sm:items-center sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="position-detail-title"
                    onClick={onClose}
                >
                    <motion.div
                        key="modal-panel"
                        initial={{ y: 48, opacity: 0, scale: 0.97 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 48, opacity: 0, scale: 0.97 }}
                        transition={{
                            type: 'spring',
                            stiffness: 340,
                            damping: 34,
                        }}
                        onClick={(event) => event.stopPropagation()}
                        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[2rem] border border-[#E3E8F2] bg-white shadow-[0_40px_120px_rgba(14,63,151,0.2)] sm:max-h-[88vh] sm:rounded-[2rem]"
                    >
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-[2rem] bg-gradient-to-b from-[#EEF3FF] to-transparent" />

                        <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-[#F0F3FA] px-7 pt-7 pb-5">
                            <div className="min-w-0 flex-1">
                                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#0E3F97]/10 bg-[#E8EEF9] px-3 py-1">
                                    <Briefcase className="h-3 w-3 text-[#0E3F97]" />
                                    <span className="text-[10px] font-black tracking-[0.18em] text-[#0E3F97] uppercase">
                                        Detail Posisi Magang
                                    </span>
                                </div>
                                <h2
                                    id="position-detail-title"
                                    className="text-2xl leading-tight font-black tracking-tight text-[#0F1E46] sm:text-[1.75rem]"
                                >
                                    {position.title}
                                </h2>
                                {position.employment_type && (
                                    <p className="mt-1 text-sm font-semibold text-[#0E3F97]">
                                        {position.employment_type ??
                                            DEFAULT_POSITION_META.employmentType}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Tutup"
                                className="shrink-0 rounded-full border border-[#E3E8F2] bg-white p-2 text-[#7A849B] shadow-sm transition-all hover:scale-110 hover:border-[#0E3F97]/20 hover:text-[#0E3F97]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-7 py-6">
                            <PositionStatsGrid stats={statItems} />

                            <div className="mb-8">
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-black tracking-wide text-[#0F1E46] uppercase">
                                    <FileText className="h-4 w-4 text-[#0E3F97]" />
                                    Deskripsi Pekerjaan
                                </h3>

                                <HTMLContent
                                    html={position.description}
                                    emptyFallback={
                                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE2EE] bg-[#F5F7FB] py-10">
                                            <FileText className="mb-2 h-8 w-8 text-[#A6AFC2]" />
                                            <p className="text-sm font-medium text-[#7A849B]">
                                                Deskripsi belum tersedia.
                                            </p>
                                        </div>
                                    }
                                />
                            </div>

                            <SelectionFlowStepper flow={selectedFlow} />
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 border-t border-[#F0F3FA] bg-white/90 px-7 py-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm leading-snug">
                                {isProfileComplete ? (
                                    <span className="text-[#7A849B]">
                                        Pastikan CV dan nomor telepon Anda sudah
                                        diisi sebelum mendaftar.
                                    </span>
                                ) : (
                                    <span className="font-semibold text-rose-500">
                                        Lengkapi profil Anda terlebih dahulu
                                        untuk bisa mendaftar.
                                    </span>
                                )}
                            </p>

                            <div className="flex shrink-0 items-center gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-xl border border-[#E3E8F2] bg-white px-5 py-2.5 text-sm font-bold text-[#65708C] shadow-sm transition-all hover:bg-[#F3F5FB] hover:text-[#0F1E46]"
                                >
                                    Batal
                                </button>

                                {isProfileComplete ? (
                                    <button
                                        type="button"
                                        onClick={() => onApply(position.id)}
                                        disabled={
                                            hasAppliedPosition ||
                                            applyingPositionId !== null
                                        }
                                        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0E3F97] to-[#1B52B8] px-7 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(14,63,151,0.28)] transition-all will-change-transform hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(14,63,151,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                    >
                                        {hasAppliedPosition
                                            ? 'Sedang Proses Seleksi'
                                            : isApplyingSelected
                                              ? 'Memproses...'
                                              : 'Lanjut Daftar'}
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                ) : (
                                    <Link
                                        href={editProfileRoute.url()}
                                        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-7 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(244,63,94,0.28)] transition-all will-change-transform hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(244,63,94,0.45)]"
                                    >
                                        Lengkapi Profil
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
