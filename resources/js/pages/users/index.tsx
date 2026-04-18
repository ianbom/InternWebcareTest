import { Head, useForm } from '@inertiajs/react';
import { Plus, UsersRound } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { store as usersStore, update as usersUpdate } from '@/routes/users';
import type {
    AdminUserFilters,
    AdminUserFormData,
    AdminUserListItem,
    AdminUserPasswordFormData,
    Paginated,
    SelectOption,
} from '@/types';
import { UserFilters } from './components/UserFilters';
import { UserFormDialog } from './components/UserFormDialog';
import { UserPagination } from './components/UserPagination';
import { UserPasswordDialog } from './components/UserPasswordDialog';
import { UserTable } from './components/UserTable';
import { useUserDialogs } from './hooks/useUserDialogs';
import { useUserFilters } from './hooks/useUserFilters';
import { EMPTY_PASSWORD_FORM, EMPTY_USER_FORM } from './utils/user-format';

type Props = {
    users: Paginated<AdminUserListItem>;
    filters: AdminUserFilters;
    options: {
        roles: SelectOption[];
        cvOptions: SelectOption[];
        sorts: SelectOption[];
    };
};

export default function UsersIndex({ users, filters, options }: Props) {
    const userForm = useForm<AdminUserFormData>(EMPTY_USER_FORM);
    const passwordForm = useForm<AdminUserPasswordFormData>(EMPTY_PASSWORD_FORM);
    const { applyFilters, draftFilters, resetFilters, setDraftFilters } =
        useUserFilters(filters);
    const {
        closeCreateDialog,
        closePasswordDialog,
        editingUser,
        isCreateOpen,
        openCreateDialog,
        openPasswordDialog,
        setIsCreateOpen,
    } = useUserDialogs(
        userForm.setData,
        passwordForm.setData,
        userForm.clearErrors,
        passwordForm.clearErrors,
    );

    const selectedSort =
        options.sorts.find((option) => option.value === filters.sort)?.label ??
        filters.sort;

    const submitUser = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        userForm.post(usersStore.url(), {
            preserveScroll: true,
            onSuccess: closeCreateDialog,
        });
    };

    const submitPassword = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!editingUser) {
            return;
        }

        passwordForm.put(usersUpdate.url(editingUser.id), {
            preserveScroll: true,
            onSuccess: closePasswordDialog,
        });
    };

    return (
        <>
            <Head title="Users" />

            <div className="min-h-screen p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <section className="overflow-hidden rounded-[32px] bg-[#102B5C] text-white shadow-[0_28px_80px_rgba(16,43,92,0.24)]">
                        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
                            <div>
                                <p className="text-xs font-bold tracking-[0.28em] text-[#8FB4FF] uppercase">
                                    Admin Console
                                </p>
                                <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                                    User Management
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100">
                                    Kelola akun admin dan candidate, lihat data
                                    profile, CV, serta update password user.
                                </p>
                            </div>
                        </div>
                    </section>

                    <Card className="rounded-[28px] border-[#DCE3F2] shadow-[0_18px_60px_rgba(16,43,92,0.08)]">
                        <CardHeader className="gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black text-[#102B5C]">
                                    Daftar User
                                </CardTitle>
                                <CardDescription>
                                    Searching, filtering, sorting, pagination,
                                    create user, dan edit password.
                                </CardDescription>
                            </div>
                            <Button
                                onClick={openCreateDialog}
                                className="rounded-full bg-[#1D449C] px-5 font-bold hover:bg-[#17377E]"
                            >
                                <Plus className="size-4" />
                                Create User
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <UserFilters
                                cvOptions={options.cvOptions}
                                draftFilters={draftFilters}
                                onApply={applyFilters}
                                onReset={resetFilters}
                                roleOptions={options.roles}
                                setDraftFilters={setDraftFilters}
                                sortOptions={options.sorts}
                            />

                            <UserTable
                                users={users.data}
                                onEditPassword={openPasswordDialog}
                            />

                            <UserPagination
                                selectedSort={selectedSort}
                                users={users}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <UserFormDialog
                data={userForm.data}
                errors={userForm.errors}
                isOpen={isCreateOpen}
                onClose={closeCreateDialog}
                onOpenChange={setIsCreateOpen}
                onSubmit={submitUser}
                processing={userForm.processing}
                setData={userForm.setData}
            />

            <UserPasswordDialog
                data={passwordForm.data}
                editingUser={editingUser}
                errors={passwordForm.errors}
                onClose={closePasswordDialog}
                onSubmit={submitPassword}
                processing={passwordForm.processing}
                setData={passwordForm.setData}
            />
        </>
    );
}
