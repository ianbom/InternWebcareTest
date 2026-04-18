import { Briefcase } from 'lucide-react';

export function PositionEmptyState({ searchQuery }: { searchQuery: string }) {
    return (
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
    );
}
