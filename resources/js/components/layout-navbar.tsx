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
    const currentDate = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

    return (
        <header className="sticky top-0 z-20 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-[16px] border-b border-[#C7CADD]/70 bg-[#FFFFFF]/95 px-2 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-[#FFFFFF]/75">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Buka menu navigasi"
                    className="inline-flex size-8 items-center justify-center rounded-full bg-[#EAECEF] text-[#1D449C] shadow-[inset_0_0_0_1px_rgba(199,202,221,0.9)] lg:hidden"
                >
                    <Menu className="size-4" />
                </button>
                <p className="text-xs font-semibold capitalize text-[#1D449C]/85 sm:text-sm">
                    {currentDate}
                </p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="ml-auto flex items-center gap-2.5 cursor-pointer outline-none group hover:opacity-80 transition-opacity">
                        <div className="hidden items-center gap-2.5 md:flex">
                            <span className="text-base font-semibold text-[#1D449C]">{userName}</span>
                            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#3D72D1] text-[10px] font-bold text-[#FFFFFF]">
                                {initials}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full bg-[#EAECEF] px-2 py-1.5 text-[11px] font-semibold text-[#1D449C] shadow-[inset_0_0_0_1px_rgba(199,202,221,0.9)] md:hidden outline-none"
                        >
                            {userName}
                            <ChevronDown className="size-3.5" />
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
