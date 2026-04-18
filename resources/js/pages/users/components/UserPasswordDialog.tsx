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
import type { AdminUserListItem, AdminUserPasswordFormData } from '@/types';

type UserPasswordDialogProps = {
    data: AdminUserPasswordFormData;
    editingUser: AdminUserListItem | null;
    errors: Partial<Record<keyof AdminUserPasswordFormData, string>>;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    setData: <Key extends keyof AdminUserPasswordFormData>(
        key: Key,
        value: AdminUserPasswordFormData[Key],
    ) => void;
};

export function UserPasswordDialog({
    data,
    editingUser,
    errors,
    onClose,
    onSubmit,
    processing,
    setData,
}: UserPasswordDialogProps) {
    return (
        <Dialog open={Boolean(editingUser)} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                onInteractOutside={(event) => {
                    if (processing) {
                        event.preventDefault();
                    }
                }}
                className="max-h-[94vh] w-[95vw] overflow-y-auto rounded-[28px] sm:max-w-xl"
            >
                <form onSubmit={onSubmit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-[#102B5C]">
                            Edit Password
                        </DialogTitle>
                        <DialogDescription>
                            {editingUser
                                ? `Password baru untuk ${editingUser.name} (${editingUser.email}).`
                                : 'Password baru untuk user.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-user-password">
                                New Password
                            </Label>
                            <Input
                                id="edit-user-password"
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
                            <Label htmlFor="edit-user-password-confirmation">
                                Confirm Password
                            </Label>
                            <Input
                                id="edit-user-password-confirmation"
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
                            disabled={processing || !editingUser}
                            className="rounded-full bg-[#1D449C] px-5 font-bold hover:bg-[#17377E]"
                        >
                            {processing ? 'Saving...' : 'Save Password'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
