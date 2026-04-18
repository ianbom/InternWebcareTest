import { CheckCircle2, CircleOff, Edit3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { PositionListItem } from '@/types';
import { formatDate, stripHtml } from '../../utils/position-format';

interface PositionTableProps {
    positions: PositionListItem[];
    onEdit: (position: PositionListItem) => void;
}

export function PositionTable({ positions, onEdit }: PositionTableProps) {
    return (
        <div className="overflow-hidden rounded-3xl border border-[#E7ECF6]">
            <Table>
                <TableHeader className="bg-[#F7F9FD]">
                    <TableRow>
                        <TableHead className="px-5 py-4">Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {positions.map((position) => (
                        <TableRow
                            key={position.id}
                            className="hover:bg-[#F9FBFF]"
                        >
                            <TableCell className="max-w-[520px] px-5 py-4 whitespace-normal">
                                <p className="font-black text-[#102B5C]">
                                    {position.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#526078]">
                                    {stripHtml(position.description) ||
                                        'Tidak ada deskripsi.'}
                                </p>
                                {position.created_by_name && (
                                    <p className="mt-2 text-xs text-[#6B7894]">
                                        Dibuat oleh {position.created_by_name}
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
                                    {position.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-[#526078]">
                                {formatDate(position.created_at)}
                            </TableCell>
                            <TableCell className="text-[#526078]">
                                {formatDate(position.updated_at)}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onEdit(position)}
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

            {positions.length === 0 && (
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
    );
}
