import { Filter, Search } from 'lucide-react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PositionFilters, SelectOption } from '@/types';

interface PositionFiltersProps {
    draftFilters: PositionFilters;
    onApply: (event: FormEvent<HTMLFormElement>) => void;
    onReset: () => void;
    setDraftFilters: Dispatch<SetStateAction<PositionFilters>>;
    sortOptions: SelectOption[];
    statusOptions: SelectOption[];
}

export function PositionFilters({
    draftFilters,
    onApply,
    onReset,
    setDraftFilters,
    sortOptions,
    statusOptions,
}: PositionFiltersProps) {
    return (
        <form
            onSubmit={onApply}
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
                    draftFilters.is_active === '' ? 'all' : draftFilters.is_active
                }
                onValueChange={(value) =>
                    setDraftFilters({
                        ...draftFilters,
                        is_active: value === 'all' ? '' : value,
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
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
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
    );
}
