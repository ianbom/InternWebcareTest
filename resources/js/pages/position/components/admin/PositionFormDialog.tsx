import type { FormEvent } from 'react';
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
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PositionFormData, PositionListItem } from '@/types';
import { FieldError } from '../shared/FieldError';

interface PositionFormDialogProps {
    data: PositionFormData;
    editingPosition: PositionListItem | null;
    errors: Partial<Record<keyof PositionFormData, string>>;
    isOpen: boolean;
    onClose: () => void;
    onOpenChange: (open: boolean) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    setData: <Key extends keyof PositionFormData>(
        key: Key,
        value: PositionFormData[Key],
    ) => void;
}

export function PositionFormDialog({
    data,
    editingPosition,
    errors,
    isOpen,
    onClose,
    onOpenChange,
    onSubmit,
    processing,
    setData,
}: PositionFormDialogProps) {
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
                className="max-h-[94vh] w-[95vw] overflow-y-auto rounded-[28px] sm:max-w-[1000px]"
            >
                <form onSubmit={onSubmit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-[#102B5C]">
                            {editingPosition ? 'Edit Position' : 'Create Position'}
                        </DialogTitle>
                        <DialogDescription>
                            Position akan ditampilkan pada halaman kandidat jika
                            statusnya aktif.
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
                                        <SelectItem value="0">Nonaktif</SelectItem>
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
                                onChange={(html) => setData('description', html)}
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
                            {processing ? 'Saving...' : 'Save Position'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
