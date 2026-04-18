import { Head, router, usePage, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Briefcase,
    CalendarClock,
    Clock3,
    FileText,
    Layers3,
    MapPin,
    Users,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import HTMLContent from '@/components/HTMLContent';
import AppLayout from '@/layouts/app-layout';
import { apply as applyPositionRoute } from '@/routes/positions';
import { edit as editProfileRoute } from '@/routes/profile';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Position {
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

interface Props {
    positions: Position[] | { data?: Position[] } | null;
    hasAppliedPosition: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
    'Semua Posisi',
    'Web Developer',
    'UI/UX Designer',
    'Graphic Designer',
    'Data Analyst',
    'Digital Marketing',
];

const ICON_SCHEMES = [
    { bg: 'bg-blue-500' },
    { bg: 'bg-orange-400' },
    { bg: 'bg-purple-500' },
    { bg: 'bg-green-500' },
    { bg: 'bg-pink-500' },
    { bg: 'bg-indigo-400' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizePositions(positions: Props['positions']): Position[] {
    if (Array.isArray(positions)) {
        return positions;
    }

    const paged = positions as { data?: Position[] } | null;

    if (Array.isArray(paged?.data)) {
        return paged.data;
    }

    return [];
}

function fallbackList(value: string[] | undefined, fallback: string[]): string[] {
    return value && value.length > 0 ? value : fallback;
}

function stripHtml(value: string | null): string {
    if (!value) {
        return '';
    }

    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListPosition({ positions, hasAppliedPosition }: Props) {
    const { auth } = usePage<any>().props;
    const isProfileComplete = Boolean(auth.user.phone && auth.user.cv_path);

    const positionList = normalizePositions(positions);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua Posisi');
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [applyingPositionId, setApplyingPositionId] = useState<number | null>(null);

    const filtered = useMemo(() => {
        return positionList.filter((position) => {
            const q = searchQuery.toLowerCase();
            const plainDesc = stripHtml(position.description).toLowerCase();
            const matchSearch =
                position.title.toLowerCase().includes(q) || plainDesc.includes(q);
            const matchCategory =
                activeCategory === 'Semua Posisi' ||
                position.title.toLowerCase().includes(activeCategory.toLowerCase());

            return matchSearch && matchCategory;
        });
    }, [positionList, searchQuery, activeCategory]);

    const handleApplyPosition = (positionId: number): void => {
        if (hasAppliedPosition || applyingPositionId !== null) {
            return;
        }

        setApplyingPositionId(positionId);

        router.post(
            applyPositionRoute.url(positionId),
            {},
            { preserveScroll: true, onFinish: () => setApplyingPositionId(null) },
        );
    };

    const closeDetailModal = (): void => {
        if (applyingPositionId !== null) {
            return;
        }

        setSelectedPosition(null);
    };

    const isApplyingSelected =
        selectedPosition !== null && applyingPositionId === selectedPosition.id;

    const selectedFlow = fallbackList(selectedPosition?.selection_flow, [
        'Lengkapi data diri dan CV',
        'Kerjakan quiz seleksi',
        'Tunggu review dari recruiter',
        'Terima hasil akhir lamaran',
    ]);

    // ─── Stat items for modal ─────────────────────────────────────────────────
    const statItems = selectedPosition
        ? [
              {
                  Icon: Clock3,
                  label: 'Jam Kerja',
                  value: selectedPosition.work_hours ?? 'Senin - Jumat, 09.00-16.00 WIB',
                  iconCls: 'text-[#0E3F97]',
                  bgCls: 'bg-[#E8EEF9]',
                  bdCls: 'border-blue-100',
              },
              {
                  Icon: MapPin,
                  label: 'Lokasi',
                  value: selectedPosition.work_location ?? 'Sidoarjo',
                  iconCls: 'text-emerald-600',
                  bgCls: 'bg-emerald-50',
                  bdCls: 'border-emerald-100',
              },
              {
                  Icon: Layers3,
                  label: 'Model Kerja',
                  value: selectedPosition.work_type ?? 'Hybrid',
                  iconCls: 'text-amber-600',
                  bgCls: 'bg-amber-50',
                  bdCls: 'border-amber-100',
              },
              {
                  Icon: CalendarClock,
                  label: 'Durasi',
                  value: selectedPosition.duration ?? '3–6 bulan',
                  iconCls: 'text-purple-600',
                  bgCls: 'bg-purple-50',
                  bdCls: 'border-purple-100',
              },
          ]
        : [];

    return (
        <AppLayout>
            <Head title="Posisi Magang - InternHub" />

            <div className="min-h-screen p-4 sm:p-6">

                {/* ── Results Header ─────────────────────────────────────────── */}
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-base font-bold text-gray-800">
                            Menampilkan {filtered.length} Posisi Magang
                        </p>
                        <p className="text-sm text-gray-400">
                            Pilih posisi, baca detail pekerjaan, lalu daftar jika sudah sesuai.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari posisi..."
                                className="h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 outline-none transition-colors focus:border-primary sm:w-72"
                            />
                            <Briefcase className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                        </div>
                        <select
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                            className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 outline-none transition-colors focus:border-primary"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ── Already Applied Banner ─────────────────────────────────── */}
                {hasAppliedPosition && (
                    <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-center">
                        <p className="text-sm font-medium text-primary">
                            Anda sedang dalam proses seleksi. Anda belum bisa mendaftar posisi lain hingga proses selesai.
                        </p>
                    </div>
                )}

                {/* ── Position Grid ──────────────────────────────────────────── */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((position, index) => {
                            const scheme = ICON_SCHEMES[index % ICON_SCHEMES.length];

                            return (
                                <div
                                    key={position.id}
                                    className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="mb-0.5 text-xs font-medium text-gray-400">InternHub</p>
                                            <h3 className="text-lg font-bold leading-tight text-gray-800 transition-colors duration-200 group-hover:text-primary">
                                                {position.title}
                                            </h3>
                                        </div>
                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${scheme.bg}`}>
                                            <Briefcase className="h-6 w-6 text-white" />
                                        </div>
                                    </div>

                                    <p className="text-sm font-semibold text-primary">
                                        {position.employment_type ?? 'Program Magang Intensif'}
                                    </p>

                                    <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                                        {stripHtml(position.description) || 'Tidak ada deskripsi tersedia untuk posisi ini.'}
                                    </p>

                                    <div className="mt-auto grid grid-cols-2 gap-2 pt-1 text-xs font-semibold text-gray-500">
                                        <span className="rounded-full bg-purple-50 px-3 py-1.5 text-center uppercase text-primary">
                                            {position.work_type ?? 'Hybrid'}
                                        </span>
                                        <span className="rounded-full bg-gray-50 px-3 py-1.5 text-center">
                                            {position.duration ?? '3-6 bulan'}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedPosition(position)}
                                        className="mt-1 block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                                    >
                                        Daftar Sekarang
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <div className="mx-auto max-w-sm rounded-3xl border border-dashed border-gray-200 bg-white p-10">
                            <Briefcase className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-xl font-semibold text-gray-700">
                                Belum Ada Posisi Tersedia
                            </h3>
                            <p className="text-sm text-gray-400">
                                {searchQuery
                                    ? 'Tidak ada hasil untuk pencarian Anda. Coba kata kunci lain.'
                                    : 'Silakan kembali lagi nanti untuk melihat posisi magang yang dibuka.'}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Detail Modal ───────────────────────────────────────────── */}
                <AnimatePresence>
                    {selectedPosition && (
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
                            onClick={closeDetailModal}
                        >
                            <motion.div
                                key="modal-panel"
                                initial={{ y: 48, opacity: 0, scale: 0.97 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 48, opacity: 0, scale: 0.97 }}
                                transition={{ type: 'spring', stiffness: 340, damping: 34 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative flex w-full max-w-4xl max-h-[92vh] flex-col overflow-hidden rounded-t-[2rem] border border-[#E3E8F2] bg-white shadow-[0_40px_120px_rgba(14,63,151,0.2)] sm:max-h-[88vh] sm:rounded-[2rem]"
                            >
                                {/* Mesh gradient deco at top */}
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-[2rem] bg-gradient-to-b from-[#EEF3FF] to-transparent" />

                                {/* ── Zone 1 · Header ───────────────────────────────── */}
                                <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-[#F0F3FA] px-7 pb-5 pt-7">
                                    <div className="min-w-0 flex-1">
                                        {/* Badge */}
                                        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#0E3F97]/10 bg-[#E8EEF9] px-3 py-1">
                                            <Briefcase className="h-3 w-3 text-[#0E3F97]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0E3F97]">
                                                Detail Posisi Magang
                                            </span>
                                        </div>
                                        {/* Title */}
                                        <h2
                                            id="position-detail-title"
                                            className="text-2xl font-black leading-tight tracking-tight text-[#0F1E46] sm:text-[1.75rem]"
                                        >
                                            {selectedPosition.title}
                                        </h2>
                                        {selectedPosition.employment_type && (
                                            <p className="mt-1 text-sm font-semibold text-[#0E3F97]">
                                                {selectedPosition.employment_type}
                                            </p>
                                        )}
                                    </div>
                                    {/* Close button */}
                                    <button
                                        type="button"
                                        onClick={closeDetailModal}
                                        aria-label="Tutup"
                                        className="shrink-0 rounded-full border border-[#E3E8F2] bg-white p-2 text-[#7A849B] shadow-sm transition-all hover:scale-110 hover:border-[#0E3F97]/20 hover:text-[#0E3F97]"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* ── Zone 2 · Scrollable Body ──────────────────────── */}
                                <div className="flex-1 overflow-y-auto px-7 py-6">

                                    {/* Stats — 4 column row */}
                                    <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                        {statItems.map(({ Icon, label, value, iconCls, bgCls, bdCls }) => (
                                            <div
                                                key={label}
                                                className={`flex items-start gap-3 rounded-2xl border ${bdCls} ${bgCls} p-4`}
                                            >
                                                <div className="shrink-0 rounded-xl bg-white/80 p-2 shadow-sm">
                                                    <Icon className={`h-4 w-4 ${iconCls}`} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="mb-0.5 text-[10px] font-black uppercase tracking-wider text-[#7A849B]">
                                                        {label}
                                                    </p>
                                                    <p className="text-[13px] font-bold leading-snug text-[#0F1E46]">
                                                        {value}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Deskripsi — full-width rich HTML (Tiptap) */}
                                    <div className="mb-8">
                                        <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[#0F1E46]">
                                            <FileText className="h-4 w-4 text-[#0E3F97]" />
                                            Deskripsi Pekerjaan
                                        </h3>

                                        <HTMLContent
                                            html={selectedPosition.description}
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

                                    {/* Alur Seleksi — horizontal stepper */}
                                    <div className="mb-6 rounded-2xl border border-[#E3E8F2] bg-[#F8FAFE] px-6 py-5">
                                        <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[#0F1E46]">
                                            <Users className="h-4 w-4 text-[#0E3F97]" />
                                            Alur Seleksi
                                        </h3>

                                        <div className="relative grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
                                            {/* Connector line, desktop only */}
                                            <div className="absolute top-5 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] hidden h-px bg-[#DCE2EE] sm:block" />

                                            {selectedFlow.map((step, i) => (
                                                <div
                                                    key={step}
                                                    className="relative z-10 flex flex-col items-center gap-2.5 text-center"
                                                >
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E3F97] text-[13px] font-black text-white shadow-[0_4px_12px_rgba(14,63,151,0.3)]">
                                                        {i + 1}
                                                    </div>
                                                    <p className="max-w-[96px] text-[12px] font-semibold leading-snug text-[#65708C]">
                                                        {step}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ── Zone 3 · Action Footer ────────────────────────── */}
                                <div className="shrink-0 flex flex-col gap-3 border-t border-[#F0F3FA] bg-white/90 px-7 py-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm leading-snug">
                                        {isProfileComplete ? (
                                            <span className="text-[#7A849B]">
                                                Pastikan CV dan nomor telepon Anda sudah diisi sebelum mendaftar.
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-rose-500">
                                                Lengkapi profil Anda terlebih dahulu untuk bisa mendaftar.
                                            </span>
                                        )}
                                    </p>

                                    <div className="flex shrink-0 items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={closeDetailModal}
                                            className="rounded-xl border border-[#E3E8F2] bg-white px-5 py-2.5 text-sm font-bold text-[#65708C] shadow-sm transition-all hover:bg-[#F3F5FB] hover:text-[#0F1E46]"
                                        >
                                            Batal
                                        </button>

                                        {isProfileComplete ? (
                                            <button
                                                type="button"
                                                onClick={() => handleApplyPosition(selectedPosition.id)}
                                                disabled={hasAppliedPosition || applyingPositionId !== null}
                                                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0E3F97] to-[#1B52B8] px-7 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(14,63,151,0.28)] will-change-transform transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(14,63,151,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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
                                                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-7 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(244,63,94,0.28)] will-change-transform transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(244,63,94,0.45)]"
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
            </div>
        </AppLayout>
    );
}
