import { router } from '@inertiajs/react';
import { useState } from 'react';
import { apply as applyPositionRoute } from '@/routes/positions';

export function useApplyPosition(hasAppliedPosition: boolean) {
    const [applyingPositionId, setApplyingPositionId] = useState<number | null>(
        null,
    );

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

    return {
        applyingPositionId,
        handleApplyPosition,
    };
}
