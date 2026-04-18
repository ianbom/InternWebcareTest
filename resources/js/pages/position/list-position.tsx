import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { AppliedPositionBanner } from './components/candidate/AppliedPositionBanner';
import { PositionCard } from './components/candidate/PositionCard';
import { PositionDetailModal } from './components/candidate/PositionDetailModal';
import { PositionEmptyState } from './components/candidate/PositionEmptyState';
import { PositionToolbar } from './components/candidate/PositionToolbar';
import { useApplyPosition } from './hooks/useApplyPosition';
import { useCandidatePositionFilter } from './hooks/useCandidatePositionFilter';
import type { CandidatePosition, CandidatePositionProps } from './types';
import { ICON_SCHEMES } from './utils/position-constants';
import { normalizePositions } from './utils/position-normalize';

export default function ListPosition({
    hasAppliedPosition,
    positions,
}: CandidatePositionProps) {
    const { auth } = usePage<any>().props;
    const isProfileComplete = Boolean(auth.user.phone && auth.user.cv_path);
    const positionList = normalizePositions(positions);
    const [selectedPosition, setSelectedPosition] =
        useState<CandidatePosition | null>(null);
    const {
        activeCategory,
        filtered,
        searchQuery,
        setActiveCategory,
        setSearchQuery,
    } = useCandidatePositionFilter(positionList);
    const { applyingPositionId, handleApplyPosition } =
        useApplyPosition(hasAppliedPosition);

    const closeDetailModal = (): void => {
        if (applyingPositionId !== null) {
            return;
        }

        setSelectedPosition(null);
    };

    return (
        <AppLayout>
            <Head title="Posisi Magang - Webcare Inter" />

            <div className="min-h-screen p-4 sm:p-6">
                <PositionToolbar
                    activeCategory={activeCategory}
                    resultCount={filtered.length}
                    searchQuery={searchQuery}
                    setActiveCategory={setActiveCategory}
                    setSearchQuery={setSearchQuery}
                />

                {hasAppliedPosition && <AppliedPositionBanner />}

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((position, index) => (
                            <PositionCard
                                key={position.id}
                                iconScheme={
                                    ICON_SCHEMES[index % ICON_SCHEMES.length]
                                }
                                position={position}
                                onSelect={setSelectedPosition}
                            />
                        ))}
                    </div>
                ) : (
                    <PositionEmptyState searchQuery={searchQuery} />
                )}

                <PositionDetailModal
                    applyingPositionId={applyingPositionId}
                    hasAppliedPosition={hasAppliedPosition}
                    isProfileComplete={isProfileComplete}
                    onApply={handleApplyPosition}
                    onClose={closeDetailModal}
                    position={selectedPosition}
                />
            </div>
        </AppLayout>
    );
}
