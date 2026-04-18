import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { AdminUserFormData, AdminUserRole } from '@/types';

type UserFormDialogProps = {
    data: AdminUserFormData;
    errors: Partial<Record<keyof AdminUserFormData, string>>;
    isOpen: boolean;
    onClose: () => void;
    onOpenChange: (open: boolean) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    setData: <Key extends keyof AdminUserFormData>(
        key: Key,
        value: AdminUserFormData[Key],
    ) => void;
};

export function UserFormDialog({
    data,
    errors,
    isOpen,
    onClose,
    onOpenChange,
    onSubmit,
    processing,
    setData,
}: UserFormDialogProps) {
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => (open ? onOpenChange(true) : onClose())}
        >
            <DialogContent
                onInteractOutside={(event) => {
                    if (processing) {
                        event.preventDefault();
                    }
                }}
                className="max-h-[94vh] w-[95vw] overflow-y-auto rounded-[28px] sm:max-w-2xl"
            >
                <form onSubmit={onSubmit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-[#102B5C]">
                            Create User
                        </DialogTitle>
                        <DialogDescription>
                            Admin dapat membuat user admin atau candidate.
                            Password tidak akan ditampilkan kembali setelah
                            disimpan.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="user-name">Name</Label>
                            <Input
                                id="user-name"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                placeholder="Nama lengkap"
                                className="rounded-2xl"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user-email">Email</Label>
                            <Input
                                id="user-email"
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                placeholder="user@example.com"
                                className="rounded-2xl"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user-phone">Phone</Label>
                            <Input
                                id="user-phone"
                                value={data.phone}
                                onChange={(event) =>
                                    setData('phone', event.target.value)
                                }
                                placeholder="08123456789"
                                className="rounded-2xl"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) =>
                                    setData('role', value as AdminUserRole)
                                }
                            >
                                <SelectTrigger className="h-11 w-full rounded-2xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="candidate">
                                        Candidate
                                    </SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user-password">Password</Label>
                            <Input
                                id="user-password"
                                type="password"
                                value={data.password}
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                                className="rounded-2xl"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user-password-confirmation">
                                Confirm Password
                            </Label>
                            <Input
                                id="user-password-confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(event) =>
                                    setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                className="rounded-2xl"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
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
                            {processing ? 'Saving...' : 'Save User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
