import { useState } from 'react';
import type { PositionFormData, PositionListItem } from '@/types';
import { EMPTY_POSITION_FORM } from '../utils/position-constants';

type SetFormData = (data: PositionFormData) => void;

export function usePositionDialog(
    setData: SetFormData,
    clearErrors: () => void,
) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPosition, setEditingPosition] =
        useState<PositionListItem | null>(null);

    const openCreateDialog = () => {
        setEditingPosition(null);
        clearErrors();
        setData({ ...EMPTY_POSITION_FORM });
        setIsDialogOpen(true);
    };

    const openEditDialog = (position: PositionListItem) => {
        setEditingPosition(position);
        clearErrors();
        setData({
            title: position.title,
            description: position.description ?? '',
            is_active: position.is_active,
        });
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingPosition(null);
        clearErrors();
        setData({ ...EMPTY_POSITION_FORM });
    };

    return {
        isDialogOpen,
        setIsDialogOpen,
        editingPosition,
        openCreateDialog,
        openEditDialog,
        closeDialog,
    };
}
