import { Head, router, usePage, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    CalendarClock,
    CheckCircle2,
    Clock3,
    FileText,
    Layers3,
    MapPin,
    Users,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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

function fallbackList(
    value: string[] | undefined,
    fallback: string[],
): string[] {
    return value && value.length > 0 ? value : fallback;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListPosition({ positions, hasAppliedPosition }: Props) {
    const { auth } = usePage<any>().props;
    const isProfileComplete = Boolean(auth.user.phone && auth.user.cv_path);

    const positionList = normalizePositions(positions);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua Posisi');
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(
        null,
    );
    const [applyingPositionId, setApplyingPositionId] = useState<number | null>(
        null,
    );

    const filtered = useMemo(() => {
        return positionList.filter((position) => {
            const q = searchQuery.toLowerCase();
            const matchSearch =
                position.title.toLowerCase().includes(q) ||
                (position.description ?? '').toLowerCase().includes(q);
            const matchCategory =
                activeCategory === 'Semua Posisi' ||
                position.title
                    .toLowerCase()
                    .includes(activeCategory.toLowerCase());

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
            {
                preserveScroll: true,
                onFinish: () => setApplyingPositionId(null),
            },
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
    const selectedRequirements = fallbackList(selectedPosition?.requirements, [
        'Memiliki minat kuat terhadap posisi yang dilamar',
        'Siap mengikuti seluruh proses seleksi',
        'Mampu bekerja dengan arahan dan feedback',
    ]);
    const selectedBenefits = fallbackList(selectedPosition?.benefits, [
        'Mentoring bersama tim internal',
        'Pengalaman project nyata',
        'Sertifikat setelah program selesai',
    ]);
    const selectedFlow = fallbackList(selectedPosition?.selection_flow, [
        'Lengkapi data diri dan CV',
        'Kerjakan quiz seleksi',
        'Tunggu review dari recruiter',
        'Terima hasil akhir lamaran',
    ]);

    return (
        <AppLayout>
            <Head title="Posisi Magang - InternHub" />

            <div className="min-h-screen p-4 sm:p-6">
                {/* ── Results header ─────────────────────────────────────── */}
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-base font-bold text-gray-800">
                            Menampilkan {filtered.length} Posisi Magang
                        </p>
                        <p className="text-sm text-gray-400">
                            Pilih posisi, baca detail pekerjaan, lalu daftar
                            jika sudah sesuai.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative">
                            <input
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Cari posisi..."
                                className="h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 transition-colors outline-none focus:border-primary sm:w-72"
                            />
                            <Briefcase className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-300" />
                        </div>
                        <select
                            value={activeCategory}
                            onChange={(event) =>
                                setActiveCategory(event.target.value)
                            }
                            className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition-colors outline-none focus:border-primary"
                        >
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ── Already Applied Banner ─────────────────────────────── */}
                {hasAppliedPosition && (
                    <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-center">
                        <p className="text-sm font-medium text-primary">
                            Anda sedang dalam proses seleksi. Anda belum bisa
                            mendaftar posisi lain hingga proses selesai.
                        </p>
                    </div>
                )}

                {/* ── Position Grid ───────────────────────────────────────── */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((position, index) => {
                            const scheme =
                                ICON_SCHEMES[index % ICON_SCHEMES.length];

                            return (
                                <div
                                    key={position.id}
                                    className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="mb-0.5 text-xs font-medium text-gray-400">
                                                InternHub
                                            </p>
                                            <h3 className="text-lg leading-tight font-bold text-gray-800 transition-colors duration-200 group-hover:text-primary">
                                                {position.title}
                                            </h3>
                                        </div>
                                        <div
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${scheme.bg}`}
                                        >
                                            <Briefcase className="h-6 w-6 text-white" />
                                        </div>
                                    </div>

                                    <p className="text-sm font-semibold text-primary">
                                        {position.employment_type ??
                                            'Program Magang Intensif'}
                                    </p>

                                    <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                                        {position.description ??
                                            'Tidak ada deskripsi tersedia untuk posisi ini.'}
                                    </p>

                                    <div className="mt-auto grid grid-cols-2 gap-2 pt-1 text-xs font-semibold text-gray-500">
                                        <span className="rounded-full bg-purple-50 px-3 py-1.5 text-center text-primary uppercase">
                                            {position.work_type ?? 'On-site'}
                                        </span>
                                        <span className="rounded-full bg-gray-50 px-3 py-1.5 text-center">
                                            {position.duration ?? '3-6 bulan'}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedPosition(position)
                                        }
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

                {selectedPosition && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="position-detail-title"
                    >
                        <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_120px_rgba(15,23,42,0.28)]">
                            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-[#0E3F97] to-[#1B52B8] p-6 text-white">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.28em] text-blue-100 uppercase">
                                        Detail Posisi Magang
                                    </p>
                                    <h2
                                        id="position-detail-title"
                                        className="mt-2 text-3xl font-black tracking-tight"
                                    >
                                        {selectedPosition.title}
                                    </h2>
                                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100">
                                        {selectedPosition.description ??
                                            'Detail posisi belum memiliki deskripsi khusus.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeDetailModal}
                                    className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                                    aria-label="Tutup detail posisi"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-2xl bg-blue-50 p-4">
                                        <Clock3 className="mb-3 h-5 w-5 text-primary" />
                                        <p className="text-xs font-bold text-gray-400 uppercase">
                                            Jam Kerja
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-gray-800">
                                            {selectedPosition.work_hours ??
                                                'Senin-Jumat, 09.00-17.00 WIB'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-emerald-50 p-4">
                                        <MapPin className="mb-3 h-5 w-5 text-emerald-600" />
                                        <p className="text-xs font-bold text-gray-400 uppercase">
                                            Tempat Kerja
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-gray-800">
                                            {selectedPosition.work_location ??
                                                'Jakarta, Indonesia'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-amber-50 p-4">
                                        <Layers3 className="mb-3 h-5 w-5 text-amber-600" />
                                        <p className="text-xs font-bold text-gray-400 uppercase">
                                            Model Kerja
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-gray-800">
                                            {selectedPosition.work_type ??
                                                'On-site'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-purple-50 p-4">
                                        <CalendarClock className="mb-3 h-5 w-5 text-purple-600" />
                                        <p className="text-xs font-bold text-gray-400 uppercase">
                                            Durasi
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-gray-800">
                                            {selectedPosition.duration ??
                                                '3-6 bulan'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                                    <div className="space-y-5">
                                        <section className="rounded-3xl border border-gray-100 p-5">
                                            <div className="mb-4 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-primary" />
                                                <h3 className="text-lg font-black text-gray-900">
                                                    Kualifikasi
                                                </h3>
                                            </div>
                                            <div className="space-y-3">
                                                {selectedRequirements.map(
                                                    (item) => (
                                                        <div
                                                            key={item}
                                                            className="flex gap-3 text-sm leading-relaxed text-gray-600"
                                                        >
                                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                                            <span>{item}</span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </section>

                                        <section className="rounded-3xl border border-gray-100 p-5">
                                            <div className="mb-4 flex items-center gap-2">
                                                <Users className="h-5 w-5 text-primary" />
                                                <h3 className="text-lg font-black text-gray-900">
                                                    Benefit Program
                                                </h3>
                                            </div>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {selectedBenefits.map(
                                                    (item) => (
                                                        <div
                                                            key={item}
                                                            className="rounded-2xl bg-gray-50 px-4 py-3 text-sm leading-relaxed font-semibold text-gray-600"
                                                        >
                                                            {item}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </section>
                                    </div>

                                    <aside className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                                        <h3 className="text-lg font-black text-gray-900">
                                            Alur Setelah Daftar
                                        </h3>
                                        <div className="mt-4 space-y-3">
                                            {selectedFlow.map((step, index) => (
                                                <div
                                                    key={step}
                                                    className="flex items-start gap-3"
                                                >
                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-white">
                                                        {index + 1}
                                                    </div>
                                                    <p className="pt-1 text-sm leading-relaxed font-semibold text-gray-600">
                                                        {step}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 rounded-2xl bg-white p-4">
                                            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                                Kuota
                                            </p>
                                            <p className="mt-1 text-2xl font-black text-primary">
                                                {selectedPosition.quota ??
                                                    'Terbatas'}
                                            </p>
                                        </div>
                                    </aside>
                                </div>
                            </div>

                            <div className="mt-auto flex shrink-0 flex-col gap-3 border-t border-gray-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-gray-500">
                                    {isProfileComplete 
                                        ? 'Pastikan data diri dan CV Anda sudah lengkap sebelum melanjutkan pendaftaran.'
                                        : <span className="font-medium text-rose-500">Anda belum bisa mendaftar. Silakan lengkapi Nomor Telepon dan CV Anda di menu Profil.</span>
                                    }
                                </p>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={closeDetailModal}
                                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>

                                    {isProfileComplete ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleApplyPosition(
                                                    selectedPosition.id,
                                                )
                                            }
                                            disabled={
                                                hasAppliedPosition ||
                                                applyingPositionId !== null
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
                                        >
                                            {hasAppliedPosition
                                                ? 'Sedang Proses Seleksi'
                                                : isApplyingSelected
                                                  ? 'Memproses...'
                                                  : 'Lanjut Daftar'}
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <Link
                                            href={editProfileRoute.url()}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600"
                                        >
                                            Lengkapi Profil
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
