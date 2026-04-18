import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowUpDown,
    BriefcaseBusiness,
    CheckCircle2,
    CircleOff,
    Edit3,
    Filter,
    Plus,
    Search,
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
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { cn } from '@/lib/utils';
import {
    index as positionsIndex,
    store as positionsStore,
    update as positionsUpdate,
} from '@/routes/positions';
import type {
    Paginated,
    PositionFilters,
    PositionFormData,
    PositionListItem,
    SelectOption,
} from '@/types';

type Props = {
    positions: Paginated<PositionListItem>;
    filters: PositionFilters;
    sortOptions: SelectOption[];
    statusOptions: SelectOption[];
};

const EMPTY_FORM: PositionFormData = {
    title: '',
    description: '',
    is_active: true,
};

function stripHtml(value: string | null): string {
    if (!value) {
        return '';
    }

    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function cleanQuery(filters: PositionFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ''),
    );
}

function formatDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function paginationLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Prev')
        .replace('Next &raquo;', 'Next')
        .replace('&laquo;', '')
        .replace('&raquo;', '')
        .trim();
}

function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="text-xs font-semibold text-rose-600">{message}</p>;
}

export default function PositionIndex({
    positions,
    filters,
    sortOptions,
    statusOptions,
}: Props) {
    const [draftFilters, setDraftFilters] = useState<PositionFilters>(filters);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPosition, setEditingPosition] =
        useState<PositionListItem | null>(null);
    const { data, setData, post, put, processing, errors, clearErrors } =
        useForm<PositionFormData>(EMPTY_FORM);

    const selectedSort =
        sortOptions.find((option) => option.value === filters.sort)?.label ??
        filters.sort;

    const activeCount = positions.data.filter(
        (position) => position.is_active,
    ).length;

    const applyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            positionsIndex.url({ query: cleanQuery(draftFilters) }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const resetFilters = () => {
        const nextFilters: PositionFilters = {
            search: '',
            is_active: '',
            sort: 'created_at_desc',
        };

        setDraftFilters(nextFilters);
        router.get(positionsIndex.url(), {}, { preserveScroll: true });
    };

    const openCreateDialog = () => {
        setEditingPosition(null);
        clearErrors();
        setData({ ...EMPTY_FORM });
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
        setData({ ...EMPTY_FORM });
    };

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
                    <section className="overflow-hidden rounded-[32px] bg-[#102B5C] text-white shadow-[0_28px_80px_rgba(16,43,92,0.24)]">
                        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
                            <div>
                                <p className="text-xs font-bold tracking-[0.28em] text-[#8FB4FF] uppercase">
                                    Admin Workspace
                                </p>
                                <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                                    Position Management
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100">
                                    Kelola posisi magang, status aktif, dan
                                    deskripsi lowongan yang akan dilihat
                                    kandidat.
                                </p>
                            </div>
                        </div>
                    </section>

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
                            <form
                                onSubmit={applyFilters}
                                className="grid gap-3 rounded-3xl border border-[#E7ECF6] bg-[#F7F9FD] p-3 lg:grid-cols-[minmax(240px,1.4fr)_190px_210px_auto]"
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
                                        placeholder="Cari title atau description..."
                                        className="h-11 rounded-2xl bg-white pl-10"
                                    />
                                </Label>

                                <Select
                                    value={
                                        draftFilters.is_active === ''
                                            ? 'all'
                                            : draftFilters.is_active
                                    }
                                    onValueChange={(value) =>
                                        setDraftFilters({
                                            ...draftFilters,
                                            is_active:
                                                value === 'all' ? '' : value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="h-11 w-full rounded-2xl bg-white">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value || 'all'}
                                                value={option.value || 'all'}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={draftFilters.sort}
                                    onValueChange={(value) =>
                                        setDraftFilters({
                                            ...draftFilters,
                                            sort: value as PositionFilters['sort'],
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
                                                Title
                                            </TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Updated</TableHead>
                                            <TableHead className="text-right">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {positions.data.map((position) => (
                                            <TableRow
                                                key={position.id}
                                                className="hover:bg-[#F9FBFF]"
                                            >
                                                <TableCell className="max-w-[520px] px-5 py-4 whitespace-normal">
                                                    <p className="font-black text-[#102B5C]">
                                                        {position.title}
                                                    </p>
                                                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#526078]">
                                                        {stripHtml(
                                                            position.description,
                                                        ) ||
                                                            'Tidak ada deskripsi.'}
                                                    </p>
                                                    {position.created_by_name && (
                                                        <p className="mt-2 text-xs text-[#6B7894]">
                                                            Dibuat oleh{' '}
                                                            {
                                                                position.created_by_name
                                                            }
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={cn(
                                                            'rounded-full px-3 py-1 font-bold',
                                                            position.is_active
                                                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-100',
                                                        )}
                                                    >
                                                        {position.is_active ? (
                                                            <CheckCircle2 className="mr-1 size-3.5" />
                                                        ) : (
                                                            <CircleOff className="mr-1 size-3.5" />
                                                        )}
                                                        {position.is_active
                                                            ? 'Aktif'
                                                            : 'Nonaktif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-[#526078]">
                                                    {formatDate(
                                                        position.created_at,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-[#526078]">
                                                    {formatDate(
                                                        position.updated_at,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            openEditDialog(
                                                                position,
                                                            )
                                                        }
                                                        className="rounded-full"
                                                    >
                                                        <Edit3 className="size-4" />
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {positions.data.length === 0 && (
                                    <div className="px-5 py-16 text-center">
                                        <p className="text-lg font-black text-[#102B5C]">
                                            Position tidak ditemukan
                                        </p>
                                        <p className="mt-2 text-sm text-[#6B7894]">
                                            Ubah filter atau buat position baru.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm text-[#6B7894]">
                                    Menampilkan {positions.from ?? 0}-
                                    {positions.to ?? 0} dari {positions.total}{' '}
                                    position
                                </p>
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F5FF] px-3 py-1.5 text-xs font-bold text-[#1D449C]">
                                    <ArrowUpDown className="size-3.5" />
                                    {selectedSort}
                                </div>
                            </div>

                            <Pagination className="justify-end">
                                <PaginationContent className="flex-wrap">
                                    {positions.links.map((link, index) => (
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
                    className="max-h-[94vh] w-[95vw] sm:max-w-[1000px] overflow-y-auto rounded-[28px]"
                >
                    <form onSubmit={submitPosition} className="space-y-5">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-[#102B5C]">
                                {editingPosition
                                    ? 'Edit Position'
                                    : 'Create Position'}
                            </DialogTitle>
                            <DialogDescription>
                                Position akan ditampilkan pada halaman kandidat
                                jika statusnya aktif.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-4">
                                <div className="space-y-2 sm:col-span-3">
                                    <Label htmlFor="position-title">Title</Label>
                                    <Input
                                        id="position-title"
                                        value={data.title}
                                        onChange={(event) =>
                                            setData('title', event.target.value)
                                        }
                                        placeholder="Frontend Developer Intern"
                                        className="rounded-2xl"
                                    />
                                    <FieldError message={errors.title} />
                                </div>

                                <div className="space-y-2 sm:col-span-1">
                                    <Label>Status</Label>
                                    <Select
                                        value={data.is_active ? '1' : '0'}
                                        onValueChange={(value) =>
                                            setData('is_active', value === '1')
                                        }
                                    >
                                        <SelectTrigger className="h-11 w-full rounded-2xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Aktif</SelectItem>
                                            <SelectItem value="0">
                                                Nonaktif
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FieldError message={errors.is_active} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position-description">
                                    Description
                                </Label>
                                <RichTextEditor
                                    value={data.description}
                                    onChange={(html) =>
                                        setData('description', html)
                                    }
                                    placeholder="Tuliskan scope pekerjaan dan ekspektasi kandidat..."
                                    minHeight="320px"
                                />
                                <FieldError message={errors.description} />
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
                                {processing ? 'Saving...' : 'Save Position'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
