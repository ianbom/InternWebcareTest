import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { AdminUserListItem } from '@/types';
import { formatDate } from '../utils/user-format';
import { UserRoleBadge } from './UserRoleBadge';

type UserTableProps = {
    onEditPassword: (user: AdminUserListItem) => void;
    users: AdminUserListItem[];
};

export function UserTable({ onEditPassword, users }: UserTableProps) {
    return (
        <div className="overflow-hidden rounded-3xl border border-[#E7ECF6]">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-[#F7F9FD]">
                        <TableRow>
                            <TableHead className="min-w-56 px-5 py-4">
                                Name
                            </TableHead>
                            <TableHead className="min-w-64">Email</TableHead>
                            <TableHead className="min-w-36">Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="min-w-44">CV</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Updated</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-[#F9FBFF]">
                                <TableCell className="px-5 py-4">
                                    <p className="font-black text-[#102B5C]">
                                        {user.name}
                                    </p>
                                    <p className="mt-1 text-xs text-[#6B7894]">
                                        User ID #{user.id}
                                    </p>
                                </TableCell>
                                <TableCell className="break-all font-semibold text-[#102B5C]">
                                    {user.email}
                                </TableCell>
                                <TableCell className="text-[#526078]">
                                    {user.phone ?? '-'}
                                </TableCell>
                                <TableCell>
                                    <UserRoleBadge role={user.role} />
                                </TableCell>
                                <TableCell>
                                    {user.cv_url ? (
                                        <a
                                            href={user.cv_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-bold text-[#1D449C] underline underline-offset-4"
                                        >
                                            Lihat CV
                                        </a>
                                    ) : (
                                        <span className="text-[#6B7894]">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-[#526078]">
                                    {formatDate(user.created_at)}
                                </TableCell>
                                <TableCell className="text-[#526078]">
                                    {formatDate(user.updated_at)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onEditPassword(user)}
                                        className="rounded-full"
                                    >
                                        <KeyRound className="size-4" />
                                        Edit Password
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {users.length === 0 && (
                <div className="px-5 py-16 text-center">
                    <p className="text-lg font-black text-[#102B5C]">
                        User tidak ditemukan
                    </p>
                    <p className="mt-2 text-sm text-[#6B7894]">
                        Ubah filter atau buat user baru.
                    </p>
                </div>
            )}
        </div>
    );
}
