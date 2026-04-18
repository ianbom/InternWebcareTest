import { useState } from 'react';
import { LayoutNavbar } from '@/components/layout-navbar';
import { LayoutSidebar } from '@/components/layout-sidebar';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#EAECEF] text-[#1D449C] pt-[env(safe-area-inset-top)]">
            <div className="grid min-h-screen w-full lg:grid-cols-[minmax(220px,16vw)_minmax(0,1fr)]">
                <LayoutSidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onClose={() => setIsMobileSidebarOpen(false)}
                />

                {/* <main className="min-w-0 p-2 pt-3 sm:p-4 lg:pb-4 lg:pl-0 lg:pr-4 lg:pt-4"> */}
                    <div className="min-h-[calc(100vh-1.5rem-env(safe-area-inset-top))] rounded-[18px] bg-[#FFFFFF] px-2 pb-4 pt-2 shadow-[inset_0_0_0_1px_rgba(115,117,122,0.22)] sm:rounded-[24px] sm:p-4 lg:p-6">
                        <LayoutNavbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
                        {children}
                    </div>
                {/* </main> */}
            </div>
        </div>
    );
}
