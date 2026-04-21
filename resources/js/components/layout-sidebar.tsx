import { Link, usePage } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    ClipboardList,
    LayoutGrid,
    Lock,
    PaperclipIcon,
    UserRound,
    UsersRound,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as applicationsIndex } from '@/routes/applications';
import {
    index as assessmentsIndex,
    list as assessmentsList,
} from '@/routes/assessments';
import { index as positionsIndex } from '@/routes/positions';
import { edit as profileEdit } from '@/routes/profile';
import { index as usersIndex } from '@/routes/users';
import type { User } from '@/types';

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

type SidebarBodyProps = {
    homeHref: string;
    items: SidebarItem[];
    pathname: string;
    role?: User['role'];
    onNavigate?: () => void;
};

function getSidebarItems(role?: User['role']): SidebarItem[] {
    if (role === 'admin') {
        return [
            {
                title: 'Positions',
                href: positionsIndex().url,
                activePaths: ['/positions'],
                icon: BriefcaseBusiness,
            },
            {
                title: 'Assessments',
                href: assessmentsList().url,
                activePaths: ['/assessments'],
                icon: ClipboardList,
            },
            {
                title: 'Applications',
                href: applicationsIndex().url,
                activePaths: ['/applications'],
                icon: PaperclipIcon,
            },
            {
                title: 'Users',
                href: usersIndex().url,
                activePaths: ['/users'],
                icon: UsersRound,
            },
            {
                title: 'Profile',
                href: profileEdit().url,
                activePaths: ['/settings/profile', '/profile'],
                icon: UserRound,
            },
        ];
    }

    return [
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
            title: 'Assesment',
            href: assessmentsIndex().url,
            activePaths: ['/my-assesment'],
            icon: PaperclipIcon,
        },
        {
            title: 'Profil',
            href: profileEdit().url,
            activePaths: ['/settings/profile', '/profile'],
            icon: UserRound,
        },
    ];
}

function SidebarBody({
    homeHref,
    items,
    pathname,
    role,
    onNavigate,
}: SidebarBodyProps) {
    const handleNavigate = () => {
        onNavigate?.();
    };

    return (
        <div className="flex h-full flex-col">
            <Link
                href={homeHref}
                className="mb-5 flex items-center gap-2.5 px-1.5"
                onClick={handleNavigate}
            >
                <img
                    src="/img/WSidebar.png"
                    alt="Webcare"
                    className="h-11 w-auto object-contain"
                />
                <span className="text-[24px] font-extrabold tracking-tight text-[#1D449C]">
                    Webcare Intern
                </span>
            </Link>

            <nav className="min-h-0 flex-1 overflow-y-auto">
                <ul className="space-y-1.5">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.activePaths.some((path) =>
                            path === '/'
                                ? pathname === '/'
                                : pathname === path ||
                                  pathname.startsWith(`${path}/`),
                        );

                        const itemContent = (
                            <>
                                <Icon className="size-4" />
                                <span className="flex-1 truncate text-[15px]">
                                    {item.title}
                                </span>
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
                                <Link
                                    href={item.href}
                                    className={itemClassName}
                                    onClick={handleNavigate}
                                >
                                    {itemContent}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <section className="relative mt-4 shrink-0 overflow-hidden rounded-[18px] bg-[#1D449C] p-3.5 text-[#FFFFFF]">
                <div className="mb-4 inline-flex rounded-[10px] bg-[#3D72D1] p-2">
                    <Lock className="size-4" />
                </div>
                <p className="text-xs leading-4 text-[#EAECEF]">
                    {role === 'admin'
                        ? 'Review application, nilai essay dan project, lalu tetapkan keputusan akhir kandidat.'
                        : 'Pantau progres seleksi, selesaikan assessment tepat waktu.'}
                </p>
                <div className="pointer-events-none absolute right-0 bottom-0 size-20 translate-x-5 translate-y-5 rounded-full bg-[#3D72D1]/45" />
                <div className="pointer-events-none absolute right-7 bottom-6 size-5 rounded-full bg-[#FFFFFF]/30" />
            </section>
        </div>
    );
}

export function LayoutSidebar({ isMobileOpen, onClose }: LayoutSidebarProps) {
    const page = usePage();
    const { auth } = page.props;
    const pathname = page.url.split('?')[0];
    const role = auth.user?.role;
    const sidebarItems = getSidebarItems(role);
    const homeHref = role === 'admin' ? positionsIndex().url : dashboard().url;

    return (
        <>
            <div
                onClick={onClose}
                className={cn(
                    'fixed inset-0 z-40 bg-[#1D449C]/40 backdrop-blur-[2px] transition-all duration-300 lg:hidden',
                    isMobileOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'pointer-events-none opacity-0',
                )}
            />

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex h-full w-[280px] max-w-[86vw] flex-col overflow-hidden bg-[#C7CADD] transition-transform duration-300 ease-in-out lg:hidden',
                    isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
                )}
            >
                {/* Safe area padding top for notch */}
                <div className="flex shrink-0 items-center justify-end px-4 pt-[max(1rem,env(safe-area-inset-top))]">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup menu navigasi"
                        className="inline-flex size-8 items-center justify-center rounded-full bg-[#EAECEF] text-[#1D449C] shadow-[inset_0_0_0_1px_rgba(199,202,221,0.9)]"
                    >
                        <X className="size-4" />
                    </button>
                </div>
                {/* Scrollable content */}
                <div className="flex flex-1 flex-col overflow-hidden px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <SidebarBody
                        homeHref={homeHref}
                        items={sidebarItems}
                        pathname={pathname}
                        role={role}
                        onNavigate={onClose}
                    />
                </div>
            </aside>

            <aside className="top-0 hidden h-full shrink-0 flex-col bg-[#C7CADD] p-4 lg:sticky lg:flex lg:h-screen lg:rounded-r-[24px]">
                <SidebarBody
                    homeHref={homeHref}
                    items={sidebarItems}
                    pathname={pathname}
                    role={role}
                />
            </aside>
        </>
    );
}
