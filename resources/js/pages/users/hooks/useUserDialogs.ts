import { useState } from 'react';
import type {
    AdminUserFormData,
    AdminUserListItem,
    AdminUserPasswordFormData,
} from '@/types';
import { EMPTY_PASSWORD_FORM, EMPTY_USER_FORM } from '../utils/user-format';

export function useUserDialogs(
    setUserData: <Key extends keyof AdminUserFormData>(
        key: Key | AdminUserFormData,
        value?: AdminUserFormData[Key],
    ) => void,
    setPasswordData: <Key extends keyof AdminUserPasswordFormData>(
        key: Key | AdminUserPasswordFormData,
        value?: AdminUserPasswordFormData[Key],
    ) => void,
    clearUserErrors: () => void,
    clearPasswordErrors: () => void,
) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUserListItem | null>(
        null,
    );

    const openCreateDialog = () => {
        clearUserErrors();
        setUserData({ ...EMPTY_USER_FORM });
        setIsCreateOpen(true);
    };

    const closeCreateDialog = () => {
        setIsCreateOpen(false);
        clearUserErrors();
        setUserData({ ...EMPTY_USER_FORM });
    };

    const openPasswordDialog = (user: AdminUserListItem) => {
        clearPasswordErrors();
        setPasswordData({ ...EMPTY_PASSWORD_FORM });
        setEditingUser(user);
    };

    const closePasswordDialog = () => {
        setEditingUser(null);
        clearPasswordErrors();
        setPasswordData({ ...EMPTY_PASSWORD_FORM });
    };

    return {
        closeCreateDialog,
        closePasswordDialog,
        editingUser,
        isCreateOpen,
        openCreateDialog,
        openPasswordDialog,
        setIsCreateOpen,
    };
}
