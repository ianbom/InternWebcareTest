import { ChevronDown, Menu } from 'lucide-react';

type LayoutNavbarProps = {
    onMenuClick?: () => void;
};

export function LayoutNavbar({ onMenuClick }: LayoutNavbarProps) {
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

            <div className="ml-auto flex items-center gap-2.5">
                <div className="hidden items-center gap-2.5 md:flex">
                    <span className="text-base font-semibold text-[#1D449C]">Andrew Forbist</span>
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#3D72D1] text-[10px] font-bold text-[#FFFFFF]">
                        AF
                    </span>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-[#EAECEF] px-2 py-1.5 text-[11px] font-semibold text-[#1D449C] shadow-[inset_0_0_0_1px_rgba(199,202,221,0.9)] md:hidden"
                >
                    Andrew Forbist
                    <ChevronDown className="size-3.5" />
                </button>
            </div>
        </header>
    );
}
