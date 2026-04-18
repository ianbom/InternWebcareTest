import { Link } from '@inertiajs/react';
import { ArrowUpDown } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';
import { paginationLabel } from '../utils/user-format';

type UserPaginationProps = {
    selectedSort: string;
    users: Pick<
        Paginated<unknown>,
        'current_page' | 'from' | 'last_page' | 'links' | 'to' | 'total'
    >;
};

export function UserPagination({ selectedSort, users }: UserPaginationProps) {
    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[#6B7894]">
                    Menampilkan {users.from ?? 0}-{users.to ?? 0} dari{' '}
                    {users.total} user
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F5FF] px-3 py-1.5 text-xs font-bold text-[#1D449C]">
                    <ArrowUpDown className="size-3.5" />
                    {selectedSort}
                </div>
            </div>

            <Pagination className="justify-end">
                <PaginationContent className="flex-wrap">
                    {users.links.map((link, index) => (
                        <PaginationItem key={`${link.label}-${index}`}>
                            <Link
                                href={link.url ?? '#'}
                                preserveScroll
                                className={cn(
                                    buttonVariants({
                                        variant: link.active ? 'default' : 'outline',
                                        size: 'sm',
                                    }),
                                    'rounded-full',
                                    !link.url && 'pointer-events-none opacity-45',
                                )}
                            >
                                {paginationLabel(link.label)}
                            </Link>
                        </PaginationItem>
                    ))}
                </PaginationContent>
            </Pagination>
        </>
    );
}
