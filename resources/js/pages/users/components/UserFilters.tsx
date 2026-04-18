import { Filter, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { AdminUserFilters, SelectOption } from '@/types';

type UserFiltersProps = {
    cvOptions: SelectOption[];
    draftFilters: AdminUserFilters;
    onApply: (event: FormEvent<HTMLFormElement>) => void;
    onReset: () => void;
    roleOptions: SelectOption[];
    setDraftFilters: (filters: AdminUserFilters) => void;
    sortOptions: SelectOption[];
};

export function UserFilters({
    cvOptions,
    draftFilters,
    onApply,
    onReset,
    roleOptions,
    setDraftFilters,
    sortOptions,
}: UserFiltersProps) {
    return (
        <form
            onSubmit={onApply}
            className="grid gap-3 rounded-3xl border border-[#E7ECF6] bg-[#F7F9FD] p-3 xl:grid-cols-[minmax(220px,1.4fr)_180px_180px_210px_auto]"
        >
            <label className="relative block">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6B7894]" />
                <Input
                    value={draftFilters.search}
                    onChange={(event) =>
                        setDraftFilters({
                            ...draftFilters,
                            search: event.target.value,
                        })
                    }
                    placeholder="Cari name, email, phone, atau CV..."
                    className="h-11 rounded-2xl bg-white pl-10"
                />
            </label>

            <Select
                value={draftFilters.role === '' ? 'all' : draftFilters.role}
                onValueChange={(value) =>
                    setDraftFilters({
                        ...draftFilters,
                        role: value === 'all' ? '' : value,
                    })
                }
            >
                <SelectTrigger className="h-11 w-full rounded-2xl bg-white">
                    <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                    {roleOptions.map((option) => (
                        <SelectItem
                            key={option.value === '' ? 'all' : option.value}
                            value={option.value === '' ? 'all' : option.value}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={draftFilters.has_cv === '' ? 'all' : draftFilters.has_cv}
                onValueChange={(value) =>
                    setDraftFilters({
                        ...draftFilters,
                        has_cv: value === 'all' ? '' : value,
                    })
                }
            >
                <SelectTrigger className="h-11 w-full rounded-2xl bg-white">
                    <SelectValue placeholder="CV" />
                </SelectTrigger>
                <SelectContent>
                    {cvOptions.map((option) => (
                        <SelectItem
                            key={option.value === '' ? 'all' : option.value}
                            value={option.value === '' ? 'all' : option.value}
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
                        sort: value as AdminUserFilters['sort'],
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
