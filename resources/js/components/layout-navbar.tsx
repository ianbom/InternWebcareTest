import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, LogOut, Home } from 'lucide-react';
import { useInitials } from '@/hooks/use-initials';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type LayoutNavbarProps = {
    onMenuClick?: () => void;
};

export function LayoutNavbar({ onMenuClick }: LayoutNavbarProps) {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const userName = auth.user?.name ?? 'User';
    const initials = getInitials(userName);
    const fullDate = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date());
    const shortDate = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
    }).format(new Date());

    return (
        <header className="sticky top-3 z-20 mx-1 mb-3 flex items-center justify-between gap-2 rounded-2xl border border-[#C7CADD]/60 bg-[#FFFFFF]/95 px-3 py-2 shadow-[0_4px_24px_rgba(29,68,156,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-[#FFFFFF]/80 sm:mx-2 sm:rounded-2xl lg:top-0 lg:mx-0 lg:rounded-[16px] lg:border-b lg:border-[#C7CADD]/70 lg:shadow-none">
            <div className="flex items-center gap-2 min-w-0">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Buka menu navigasi"
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EAECEF] text-[#1D449C] shadow-[inset_0_0_0_1px_rgba(199,202,221,0.9)] lg:hidden"
                >
                    <Menu className="size-4" />
                </button>
                <p className="truncate text-xs font-semibold capitalize text-[#1D449C]/85 sm:text-sm">
                    <span className="hidden sm:inline">{fullDate}</span>
                    <span className="sm:hidden">{shortDate}</span>
                </p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="ml-auto flex items-center gap-2.5 cursor-pointer outline-none group hover:opacity-80 transition-opacity min-w-0">
                        <div className="hidden items-center gap-2.5 md:flex">
                            <span className="text-base font-semibold text-[#1D449C] truncate max-w-[150px]">{userName}</span>
                            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#3D72D1] text-[10px] font-bold text-[#FFFFFF]">
                                {initials}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full bg-[#EAECEF] px-2 py-1.5 text-[11px] font-semibold text-[#1D449C] shadow-[inset_0_0_0_1px_rgba(199,202,221,0.9)] md:hidden outline-none max-w-[120px]"
                        >
                            <span className="truncate">{userName}</span>
                            <ChevronDown className="size-3.5 shrink-0" />
                        </button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border border-[#C7CADD]/50 rounded-xl shadow-lg mt-1">
                    <DropdownMenuLabel className="font-semibold text-[#102B5C] py-2">Akun Saya</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#EAECEF]" />
                    <DropdownMenuItem asChild className="cursor-pointer py-2 hover:bg-[#F0F5FF]">
                        <Link href="/">
                            <Home className="mr-2 size-4 text-[#1D449C]" />
                            <span className="text-[#102B5C] font-medium">Home</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-2 hover:bg-rose-50 text-rose-600 focus:text-rose-700">
                        <Link href="/logout" method="post" as="button" className="w-full text-left">
                            <LogOut className="mr-2 size-4" />
                            <span className="font-medium">Logout</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
