import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowUpDown,
    Edit3,
    Eye,
    Filter,
    Plus,
    Search,
    Timer,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { FieldError } from '@/pages/shared/FieldError';
import {
    show as assessmentsShow,
    store as assessmentsStore,
    update as assessmentsUpdate,
} from '@/routes/assessments';
import type {
    AssessmentFilters,
    AssessmentFormData,
    AssessmentListItem,
    Paginated,
    PositionOption,
    SelectOption,
} from '@/types';
import { AssessmentEmptyState } from './components/admin/AssessmentEmptyState';
import { AssessmentHero } from './components/admin/AssessmentHero';
import { useAssessmentFilters } from './hooks/useAssessmentFilters';
import {
    EMPTY_ASSESSMENT_FORM,
    formatDate,
    paginationLabel,
} from './utils/assessment-format';

type Props = {
    assessments: Paginated<AssessmentListItem>;
    filters: AssessmentFilters;
    positionOptions: PositionOption[];
    sortOptions: SelectOption[];
};

export default function AssessmentIndex({
    assessments,
    filters,
    positionOptions,
    sortOptions,
}: Props) {
    const { applyFilters, draftFilters, resetFilters, setDraftFilters } =
        useAssessmentFilters(filters);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAssessment, setEditingAssessment] =
        useState<AssessmentListItem | null>(null);
    const { data, setData, post, put, processing, errors, clearErrors } =
        useForm<AssessmentFormData>(EMPTY_ASSESSMENT_FORM);

    const selectedSort =
        sortOptions.find((option) => option.value === filters.sort)?.label ??
        filters.sort;
    const openCreateDialog = () => {
        setEditingAssessment(null);
        clearErrors();
        setData({
            ...EMPTY_ASSESSMENT_FORM,
            position_id: positionOptions[0]?.id
                ? String(positionOptions[0].id)
                : '',
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (assessment: AssessmentListItem) => {
        setEditingAssessment(assessment);
        clearErrors();
        setData({
            position_id: String(assessment.position_id),
            title: assessment.title,
            duration_minutes: String(assessment.duration_minutes),
        });
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingAssessment(null);
        clearErrors();
        setData({ ...EMPTY_ASSESSMENT_FORM });
    };

    const submitAssessment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: closeDialog };

        if (editingAssessment) {
            put(assessmentsUpdate.url(editingAssessment.id), options);

            return;
        }

        post(assessmentsStore.url(), options);
    };

    return (
        <>
            <Head title="Assessments" />
            <div className="min-h-screen p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <AssessmentHero
                        description="Buat assessment per position, atur durasi, lalu kelola question dan project task dari detail."
                        eyebrow="Assessment Studio"
                        title="Assessment Management"
                    />

                    <Card className="rounded-[28px] border-[#DCE3F2] shadow-[0_18px_60px_rgba(16,43,92,0.08)]">
                        <CardHeader className="gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black text-[#102B5C]">
                                    Daftar Assessment
                                </CardTitle>
                                <CardDescription>
                                    Search, filter position/durasi, sort,
                                    pagination, dan CRUD modal.
                                </CardDescription>
                            </div>
                            <Button
                                onClick={openCreateDialog}
                                className="rounded-full bg-[#1D449C] px-5 font-bold hover:bg-[#17377E]"
                                disabled={positionOptions.length === 0}
                            >
                                <Plus className="size-4" />
                                Create Assessment
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <form
                                onSubmit={applyFilters}
                                className="grid gap-3 rounded-3xl border border-[#E7ECF6] bg-[#F7F9FD] p-3 xl:grid-cols-[minmax(220px,1.4fr)_210px_120px_120px_210px_auto]"
                            >
                                <Label className="relative block">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6B7894]" />
                                    <Input
                                        value={draftFilters.search}
                                        onChange={(event) =>
                                            setDraftFilters({
                                                ...draftFilters,
                                                search: event.target.value,
                                            })
                                        }
                                        placeholder="Cari assessment atau position..."
                                        className="h-11 rounded-2xl bg-white pl-10"
                                    />
                                </Label>

                                <Select
                                    value={
                                        draftFilters.position_id === ''
                                            ? 'all'
                                            : draftFilters.position_id
                                    }
                                    onValueChange={(value) =>
                                        setDraftFilters({
                                            ...draftFilters,
                                            position_id:
                                                value === 'all' ? '' : value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="h-11 w-full rounded-2xl bg-white">
                                        <SelectValue placeholder="Position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua position
                                        </SelectItem>
                                        {positionOptions.map((position) => (
                                            <SelectItem
                                                key={position.id}
                                                value={String(position.id)}
                                            >
                                                {position.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Input
                                    type="number"
                                    min="1"
                                    value={draftFilters.duration_min}
                                    onChange={(event) =>
                                        setDraftFilters({
                                            ...draftFilters,
                                            duration_min: event.target.value,
                                        })
                                    }
                                    placeholder="Min"
                                    className="h-11 rounded-2xl bg-white"
                                />
                                <Input
                                    type="number"
                                    min="1"
                                    value={draftFilters.duration_max}
                                    onChange={(event) =>
                                        setDraftFilters({
                                            ...draftFilters,
                                            duration_max: event.target.value,
                                        })
                                    }
                                    placeholder="Max"
                                    className="h-11 rounded-2xl bg-white"
                                />

                                <Select
                                    value={draftFilters.sort}
                                    onValueChange={(value) =>
                                        setDraftFilters({
                                            ...draftFilters,
                                            sort: value as AssessmentFilters['sort'],
                                        })
                                    }
                                >
                                    <SelectTrigger className="h-11 w-full rounded-2xl bg-white">
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="h-11 flex-1 rounded-2xl bg-white"
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="h-11 flex-1 rounded-2xl bg-[#102B5C] font-bold hover:bg-[#1D449C]"
                                    >
                                        <Filter className="size-4" />
                                        Apply
                                    </Button>
                                </div>
                            </form>

                            <div className="overflow-hidden rounded-3xl border border-[#E7ECF6]">
                                <Table>
                                    <TableHeader className="bg-[#F7F9FD]">
                                        <TableRow>
                                            <TableHead className="px-5 py-4">
                                                Assessment
                                            </TableHead>
                                            <TableHead>Position</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Content</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assessments.data.map((assessment) => (
                                            <TableRow
                                                key={assessment.id}
                                                className="hover:bg-[#F9FBFF]"
                                            >
                                                <TableCell className="px-5 py-4">
                                                    <p className="font-black text-[#102B5C]">
                                                        {assessment.title}
                                                    </p>
                                                    {assessment.created_by_name && (
                                                        <p className="mt-1 text-xs text-[#6B7894]">
                                                            Dibuat oleh{' '}
                                                            {
                                                                assessment.created_by_name
                                                            }
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-semibold text-[#102B5C]">
                                                    {assessment.position_title ??
                                                        '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700 hover:bg-blue-50">
                                                        <Timer className="mr-1 size-3.5" />
                                                        {
                                                            assessment.duration_minutes
                                                        }{' '}
                                                        menit
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-full"
                                                        >
                                                            {
                                                                assessment.questions_count
                                                            }{' '}
                                                            questions
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="rounded-full"
                                                        >
                                                            {
                                                                assessment.project_tasks_count
                                                            }{' '}
                                                            tasks
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-[#526078]">
                                                    {formatDate(
                                                        assessment.created_at,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    assessment,
                                                                )
                                                            }
                                                            className="rounded-full"
                                                        >
                                                            <Edit3 className="size-4" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            asChild
                                                            className="rounded-full bg-[#102B5C] hover:bg-[#1D449C]"
                                                        >
                                                            <Link
                                                                href={assessmentsShow.url(
                                                                    assessment.id,
                                                                )}
                                                            >
                                                                <Eye className="size-4" />
                                                                Detail
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {assessments.data.length === 0 && (
                                    <div className="px-5 py-16">
                                        <AssessmentEmptyState text="Assessment tidak ditemukan. Ubah filter atau buat assessment baru." />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm text-[#6B7894]">
                                    Menampilkan {assessments.from ?? 0}-
                                    {assessments.to ?? 0} dari{' '}
                                    {assessments.total} assessment
                                </p>
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F5FF] px-3 py-1.5 text-xs font-bold text-[#1D449C]">
                                    <ArrowUpDown className="size-3.5" />
                                    {selectedSort}
                                </div>
                            </div>

                            <Pagination className="justify-end">
                                <PaginationContent className="flex-wrap">
                                    {assessments.links.map((link, index) => (
                                        <PaginationItem
                                            key={`${link.label}-${index}`}
                                        >
                                            <Link
                                                href={link.url ?? '#'}
                                                preserveScroll
                                                className={cn(
                                                    buttonVariants({
                                                        variant: link.active
                                                            ? 'default'
                                                            : 'outline',
                                                        size: 'sm',
                                                    }),
                                                    'rounded-full',
                                                    !link.url &&
                                                        'pointer-events-none opacity-45',
                                                )}
                                            >
                                                {paginationLabel(link.label)}
                                            </Link>
                                        </PaginationItem>
                                    ))}
                                </PaginationContent>
                            </Pagination>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) =>
                    open ? setIsDialogOpen(true) : closeDialog()
                }
            >
                <DialogContent
                    onInteractOutside={(event) => {
                        if (processing) {
                            event.preventDefault();
                        }
                    }}
                    className="max-w-2xl rounded-[28px]"
                >
                    <form onSubmit={submitAssessment} className="space-y-5">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-[#102B5C]">
                                {editingAssessment
                                    ? 'Edit Assessment'
                                    : 'Create Assessment'}
                            </DialogTitle>
                            <DialogDescription>
                                Hubungkan assessment ke position dan tentukan
                                durasi pengerjaan kandidat.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Position</Label>
                                <Select
                                    value={data.position_id}
                                    onValueChange={(value) =>
                                        setData('position_id', value)
                                    }
                                >
                                    <SelectTrigger className="h-11 w-full rounded-2xl">
                                        <SelectValue placeholder="Pilih position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {positionOptions.map((position) => (
                                            <SelectItem
                                                key={position.id}
                                                value={String(position.id)}
                                            >
                                                {position.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.position_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assessment-title">Title</Label>
                                <Input
                                    id="assessment-title"
                                    value={data.title}
                                    onChange={(event) =>
                                        setData('title', event.target.value)
                                    }
                                    placeholder="Frontend Technical Assessment"
                                    className="rounded-2xl"
                                />
                                <FieldError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assessment-duration">
                                    Duration Minutes
                                </Label>
                                <Input
                                    id="assessment-duration"
                                    type="number"
                                    min="1"
                                    value={data.duration_minutes}
                                    onChange={(event) =>
                                        setData(
                                            'duration_minutes',
                                            event.target.value,
                                        )
                                    }
                                    className="rounded-2xl"
                                />
                                <FieldError message={errors.duration_minutes} />
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDialog}
                                disabled={processing}
                                className="rounded-full"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="rounded-full bg-[#1D449C] px-5 font-bold hover:bg-[#17377E]"
                            >
                                {processing ? 'Saving...' : 'Save Assessment'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
