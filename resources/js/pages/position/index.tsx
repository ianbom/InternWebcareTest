import { Head, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { store as positionsStore, update as positionsUpdate } from '@/routes/positions';
import type {
    Paginated,
    PositionFilters,
    PositionFormData,
    PositionListItem,
    SelectOption,
} from '@/types';
import { PositionFilters as PositionFiltersForm } from './components/admin/PositionFilters';
import { PositionFormDialog } from './components/admin/PositionFormDialog';
import { PositionHero } from './components/admin/PositionHero';
import { PositionPagination } from './components/admin/PositionPagination';
import { PositionTable } from './components/admin/PositionTable';
import { usePositionDialog } from './hooks/usePositionDialog';
import { usePositionFilters } from './hooks/usePositionFilters';
import { EMPTY_POSITION_FORM } from './utils/position-constants';

type Props = {
    positions: Paginated<PositionListItem>;
    filters: PositionFilters;
    sortOptions: SelectOption[];
    statusOptions: SelectOption[];
};

export default function PositionIndex({
    positions,
    filters,
    sortOptions,
    statusOptions,
}: Props) {
    const { data, setData, post, put, processing, errors, clearErrors } =
        useForm<PositionFormData>(EMPTY_POSITION_FORM);
    const {
        applyFilters,
        draftFilters,
        resetFilters,
        setDraftFilters,
    } = usePositionFilters(filters);
    const {
        closeDialog,
        editingPosition,
        isDialogOpen,
        openCreateDialog,
        openEditDialog,
        setIsDialogOpen,
    } = usePositionDialog(setData, clearErrors);

    const selectedSort =
        sortOptions.find((option) => option.value === filters.sort)?.label ??
        filters.sort;

    const submitPosition = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: closeDialog,
        };

        if (editingPosition) {
            put(positionsUpdate.url(editingPosition.id), options);

            return;
        }

        post(positionsStore.url(), options);
    };

    return (
        <>
            <Head title="Positions" />

            <div className="min-h-screen p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <PositionHero />

                    <Card className="rounded-[28px] border-[#DCE3F2] shadow-[0_18px_60px_rgba(16,43,92,0.08)]">
                        <CardHeader className="gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black text-[#102B5C]">
                                    Daftar Position
                                </CardTitle>
                                <CardDescription>
                                    Searching, filtering, sorting, dan
                                    pagination untuk data posisi.
                                </CardDescription>
                            </div>
                            <Button
                                onClick={openCreateDialog}
                                className="rounded-full bg-[#1D449C] px-5 font-bold hover:bg-[#17377E]"
                            >
                                <Plus className="size-4" />
                                Create Position
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <PositionFiltersForm
                                draftFilters={draftFilters}
                                onApply={applyFilters}
                                onReset={resetFilters}
                                setDraftFilters={setDraftFilters}
                                sortOptions={sortOptions}
                                statusOptions={statusOptions}
                            />

                            <PositionTable
                                positions={positions.data}
                                onEdit={openEditDialog}
                            />

                            <PositionPagination
                                positions={positions}
                                selectedSort={selectedSort}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <PositionFormDialog
                data={data}
                editingPosition={editingPosition}
                errors={errors}
                isOpen={isDialogOpen}
                onClose={closeDialog}
                onOpenChange={setIsDialogOpen}
                onSubmit={submitPosition}
                processing={processing}
                setData={setData}
            />
        </>
    );
}
