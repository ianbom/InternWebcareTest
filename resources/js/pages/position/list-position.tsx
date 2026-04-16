import { Head, router } from '@inertiajs/react';
import {
    ArrowUpDown,
    Briefcase,
    CheckCircle2,
    ChevronDown,
    Circle,
    LayoutGrid,
    List as ListIcon,
    MapPin,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Position {
    id: number;
    title: string;
    description: string | null;
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

function normalizePositions(
    positions: Props['positions'],
): Position[] {
    if (Array.isArray(positions)) {
        return positions;
    }

    const paged = positions as { data?: Position[] } | null;

    if (Array.isArray(paged?.data)) {
        return paged.data;
    }

    return [];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListPosition({ positions, hasAppliedPosition }: Props) {
    const positionList = normalizePositions(positions);

    const [searchQuery, setSearchQuery]     = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua Posisi');
    const [viewMode, setViewMode]           = useState<'grid' | 'list'>('grid');
    const [typeFilter, setTypeFilter]       = useState<'fulltime' | 'freelance'>('fulltime');
    const [applyingPositionId, setApplyingPositionId] = useState<number | null>(null);

    const filtered = useMemo(() => {
        return positionList.filter((p) => {
            const q = searchQuery.toLowerCase();
            const matchSearch =
                p.title.toLowerCase().includes(q) ||
                (p.description ?? '').toLowerCase().includes(q);
            const matchCat =
                activeCategory === 'Semua Posisi' ||
                p.title.toLowerCase().includes(activeCategory.toLowerCase());

            return matchSearch && matchCat;
        });
    }, [positionList, searchQuery, activeCategory]);

    const handleApplyPosition = (positionId: number): void => {
        if (hasAppliedPosition || applyingPositionId !== null) {
            return;
        }

        setApplyingPositionId(positionId);

        router.post(
            `/positions/${positionId}/apply`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setApplyingPositionId(null),
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Posisi Magang - InternHub" />

            <div className="min-h-screen p-4 sm:p-6">

                {/* ── Search Bar ─────────────────────────────────────────── */}
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                    {/* Location picker */}
                    <button className="flex shrink-0 items-center gap-1.5 border-r border-gray-200 pr-4 text-sm font-semibold text-gray-700">
                        <MapPin className="h-4 w-4 text-primary" />
                        Semua Kota
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </button>

                    {/* Search input */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari berdasarkan Judul atau kata kunci posisi..."
                        className="min-w-0 flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                    />

                    {/* Filter button */}
                    <button className="hidden shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:flex">
                        <SlidersHorizontal className="h-4 w-4" />
                        FILTER
                    </button>

                    {/* Find button */}
                    <button className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                        <Search className="h-4 w-4" />
                        FIND
                    </button>
                </div>

                {/* ── Category Pills ─────────────────────────────────────── */}
                <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="shrink-0 text-sm font-medium text-gray-400">Saran</span>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                                activeCategory === cat
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'bg-purple-50 text-primary hover:bg-purple-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── Results header ─────────────────────────────────────── */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    {/* Count */}
                    <div>
                        <p className="text-base font-bold text-gray-800">
                            Menampilkan {filtered.length} Posisi Magang
                        </p>
                        <p className="text-sm text-gray-400">Berdasarkan preferensi Anda</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        {/* Type filter */}
                        <button
                            onClick={() => setTypeFilter('fulltime')}
                            className="hidden items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 sm:flex"
                        >
                            {typeFilter === 'fulltime'
                                ? <CheckCircle2 className="h-4 w-4 text-primary" />
                                : <Circle className="h-4 w-4 text-gray-300" />}
                            Full Time
                        </button>
                        <button
                            onClick={() => setTypeFilter('freelance')}
                            className="hidden items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 sm:flex"
                        >
                            {typeFilter === 'freelance'
                                ? <CheckCircle2 className="h-4 w-4 text-primary" />
                                : <Circle className="h-4 w-4 text-gray-300" />}
                            Magang
                        </button>

                        {/* Sort */}
                        <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            Terbaru
                            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                        </button>

                        {/* View toggle */}
                        <div className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`rounded-lg p-1.5 transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-primary text-white'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <ListIcon className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded-lg p-1.5 transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-primary text-white'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Already Applied Banner ─────────────────────────────── */}
                {hasAppliedPosition && (
                    <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-center">
                        <p className="text-sm font-medium text-primary">
                            Anda sedang dalam proses seleksi. Anda belum bisa mendaftar posisi lain hingga proses selesai.
                        </p>
                    </div>
                )}

                {/* ── Position Grid / List ────────────────────────────────── */}
                {filtered.length > 0 ? (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'
                                : 'flex flex-col gap-4'
                        }
                    >
                        {filtered.map((position, index) => {
                            const scheme = ICON_SCHEMES[index % ICON_SCHEMES.length];
                            const isApplying = applyingPositionId === position.id;

                            return (
                                <div
                                    key={position.id}
                                    className={`group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                                        viewMode === 'list' ? 'sm:flex-row sm:items-start sm:gap-5' : ''
                                    }`}
                                >
                                    {/* Card Top: info + icon */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="mb-0.5 text-xs font-medium text-gray-400">
                                                InternHub
                                            </p>
                                            <h3 className="text-lg font-bold leading-tight text-gray-800 group-hover:text-primary transition-colors duration-200">
                                                {position.title}
                                            </h3>
                                        </div>
                                        {/* Colorful icon */}
                                        <div
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${scheme.bg}`}
                                        >
                                            <Briefcase className="h-6 w-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Salary-style label */}
                                    <p className="text-sm font-semibold text-primary">
                                        Program Magang Intensif
                                    </p>

                                    {/* Description */}
                                    <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                                        {position.description ??
                                            'Tidak ada deskripsi tersedia untuk posisi ini.'}
                                    </p>

                                    {/* Footer: badge + location */}
                                    <div className="mt-auto flex items-center justify-between pt-1">
                                        <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                                            Full Time
                                        </span>
                                        <span className="text-sm font-medium text-gray-500">
                                            Jakarta, Indonesia
                                        </span>
                                    </div>

                                    {/* CTA */}
                                    {hasAppliedPosition ? (
                                        <button
                                            disabled
                                            className="mt-1 w-full cursor-not-allowed rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-400"
                                        >
                                            Sedang Proses Seleksi
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleApplyPosition(position.id)}
                                            disabled={applyingPositionId !== null}
                                            className="mt-1 block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/70"
                                        >
                                            {isApplying ? 'Memproses...' : 'Daftar Sekarang'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* ── Empty state ──────────────────────────────────────── */
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
            </div>
        </AppLayout>
    );
}
