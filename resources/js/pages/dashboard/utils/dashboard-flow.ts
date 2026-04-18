import type { StatusTone, StepKey } from '../types';

export const STATUS_TONE_CLASSES: Record<StatusTone, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    info: 'bg-blue-50 text-blue-700',
    warning: 'bg-amber-50 text-amber-700',
    success: 'bg-emerald-50 text-emerald-700',
    danger: 'bg-rose-50 text-rose-700',
};

export const STATUS_PANEL_CLASSES: Record<StatusTone, string> = {
    neutral: 'bg-slate-50 text-slate-700',
    info: 'bg-blue-50 text-blue-800',
    warning: 'bg-amber-50 text-amber-800',
    success: 'bg-emerald-50 text-emerald-800',
    danger: 'bg-rose-50 text-rose-800',
};

export function getStepState(
    stepKey: StepKey,
    activeStep: StepKey,
    hasProjectTasks: boolean,
): 'done' | 'active' | 'pending' | 'skipped' {
    if (stepKey === 'project' && !hasProjectTasks) {
        return 'skipped';
    }

    const stepOrder: StepKey[] = [
        'profile',
        'quiz',
        'project',
        'review',
        'result',
    ];
    const currentIndex = stepOrder.indexOf(activeStep);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) {
        return 'done';
    }

    if (stepIndex === currentIndex) {
        return 'active';
    }

    return 'pending';
}

export function buildCvAlertMessage(hasCv: boolean): string {
    if (hasCv) {
        return 'CV Anda sudah terunggah. Pastikan selalu update versi terbaru.';
    }

    return 'Harap unggah CV Anda terlebih dahulu. Pastikan menggunakan CV terbaru';
}
