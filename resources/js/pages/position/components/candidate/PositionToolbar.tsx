import { Briefcase } from 'lucide-react';
import { CATEGORIES } from '../../utils/position-constants';

interface PositionToolbarProps {
    activeCategory: string;
    resultCount: number;
    searchQuery: string;
    setActiveCategory: (category: string) => void;
    setSearchQuery: (query: string) => void;
}

export function PositionToolbar({
    activeCategory,
    resultCount,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
}: PositionToolbarProps) {
    return (
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <p className="text-base font-bold text-gray-800">
                    Menampilkan {resultCount} Posisi Magang
                </p>
                <p className="text-sm text-gray-400">
                    Pilih posisi, baca detail pekerjaan, lalu daftar jika sudah
                    sesuai.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                    <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Cari posisi..."
                        className="h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 outline-none transition-colors focus:border-primary sm:w-72"
                    />
                    <Briefcase className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-300" />
                </div>
                <select
                    value={activeCategory}
                    onChange={(event) => setActiveCategory(event.target.value)}
                    className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 outline-none transition-colors focus:border-primary"
                >
                    {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
