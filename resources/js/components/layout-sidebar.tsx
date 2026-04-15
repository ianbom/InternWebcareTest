import { Link, usePage } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    LayoutGrid,
    Lock,
    UserRound,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as positionsIndex } from '@/routes/positions';
import { edit as profileEdit } from '@/routes/profile';

type SidebarItem = {
    title: string;
    href: string;
    activePaths: string[];
    icon: LucideIcon;
};

type LayoutSidebarProps = {
    isMobileOpen: boolean;
    onClose: () => void;
};

const sidebarItems: SidebarItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        activePaths: ['/dashboard'],
        icon: LayoutGrid,
    },
    {
        title: 'Posisi Magang',
        href: positionsIndex().url,
        activePaths: ['/positions'],
        icon: BriefcaseBusiness,
    },
    {
        title: 'Profil',
        href: profileEdit().url,
        activePaths: ['/settings/profile', '/profile'],
        icon: UserRound,
    },
];

type SidebarBodyProps = {
    pathname: string;
    onNavigate?: () => void;
};

function SidebarBody({ pathname, onNavigate }: SidebarBodyProps) {
    const handleNavigate = () => {
        onNavigate?.();
    };

    return (
        <>
            <Link href={dashboard()} className="mb-5 flex items-center gap-2.5 px-1.5" onClick={handleNavigate}>
                <div className="grid grid-cols-2 gap-1.5">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <span key={index} className="size-2.5 rounded-[4px] bg-[#1D449C]" />
                    ))}
                </div>
                <span className="text-[24px] font-extrabold tracking-tight text-[#1D449C]">
                    InternHub
                </span>
            </Link>

            <nav className="flex-1">
                <ul className="space-y-1.5">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.activePaths.some((path) =>
                            path === '/'
                                ? pathname === '/'
                                : pathname === path || pathname.startsWith(`${path}/`),
                        );

                        const itemContent = (
                            <>
                                <Icon className="size-4" />
                                <span className="flex-1 truncate text-[15px]">{item.title}</span>
                            </>
                        );

                        const itemClassName = cn(
                            'flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2 text-sm font-medium transition-colors duration-200',
                            isActive
                                ? 'bg-[#3D72D1] text-[#FFFFFF]'
                                : 'text-[#1D449C] hover:bg-[#EAECEF]',
                        );

                        return (
                            <li key={item.title}>
                                <Link href={item.href} className={itemClassName} onClick={handleNavigate}>
                                    {itemContent}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <section className="relative mt-4 overflow-hidden rounded-[18px] bg-[#1D449C] p-3.5 text-[#FFFFFF]">
                <div className="mb-4 inline-flex rounded-[10px] bg-[#3D72D1] p-2">
                    <Lock className="size-4" />
                </div>
                <p className="text-xs leading-4 text-[#EAECEF]">
                    Pantau progres seleksi, selesaikan assessment tepat waktu, dan lengkapi profilmu.
                </p>
                <Link
                    href={positionsIndex()}
                    onClick={handleNavigate}
                    className="mt-4 rounded-full bg-[#3D72D1] px-4 py-1.5 text-xs font-semibold text-[#FFFFFF] transition-transform duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                    Lihat Posisi
                </Link>

                <div className="pointer-events-none absolute bottom-0 right-0 size-20 translate-x-5 translate-y-5 rounded-full bg-[#3D72D1]/45" />
                <div className="pointer-events-none absolute bottom-6 right-7 size-5 rounded-full bg-[#FFFFFF]/30" />
            </section>
        </>
    );
}

export function LayoutSidebar({ isMobileOpen, onClose }: LayoutSidebarProps) {
    const { url } = usePage();
    const pathname = url.split('?')[0];

    return (
        <>
            <div
                onClick={onClose}
                className={cn(
                    'fixed inset-0 z-40 bg-[#1D449C]/40 transition-opacity duration-300 lg:hidden',
                    isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
            />

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex h-full w-[280px] max-w-[86vw] flex-col bg-[#C7CADD] p-4 transition-transform duration-300 lg:hidden',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup menu navigasi"
                    className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-[#EAECEF] text-[#1D449C] shadow-[inset_0_0_0_1px_rgba(199,202,221,0.9)]"
                >
                    <X className="size-4" />
                </button>
                <SidebarBody pathname={pathname} onNavigate={onClose} />
            </aside>

            <aside className="top-0 hidden h-full shrink-0 flex-col bg-[#C7CADD] p-4 lg:sticky lg:flex lg:h-screen lg:rounded-r-[24px]">
                <SidebarBody pathname={pathname} />
            </aside>
        </>
    );
}
