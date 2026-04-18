import type { IconScheme } from '../types';

export const EMPTY_POSITION_FORM = {
    title: '',
    description: '',
    is_active: true,
};

export const CATEGORIES = [
    'Semua Posisi',
    'Web Developer',
    'UI/UX Designer',
    'Graphic Designer',
    'Data Analyst',
    'Digital Marketing',
];

export const ICON_SCHEMES: IconScheme[] = [
    { bg: 'bg-blue-500' },
    { bg: 'bg-orange-400' },
    { bg: 'bg-purple-500' },
    { bg: 'bg-green-500' },
    { bg: 'bg-pink-500' },
    { bg: 'bg-indigo-400' },
];

export const DEFAULT_SELECTION_FLOW = [
    'Lengkapi data diri dan CV',
    'Kerjakan quiz seleksi',
    'Tunggu review dari recruiter',
    'Terima hasil akhir lamaran',
];

export const DEFAULT_POSITION_META = {
    employmentType: 'Program Magang Intensif',
    workType: 'Hybrid',
    workLocation: 'Sidoarjo',
    workHours: 'Senin - Jumat, 09.00-16.00 WIB',
    duration: '3-6 bulan',
};
