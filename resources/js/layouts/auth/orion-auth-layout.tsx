import { Link, usePage } from '@inertiajs/react';
import type { AuthLayoutProps } from '@/types';

export default function OrionAuthLayout({ children }: AuthLayoutProps) {
    const { url } = usePage();
    const isLogin = url.startsWith('/login');

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F1F4FA] p-4 font-sans text-[#131110] antialiased md:p-8">
            <div
                className="grid w-full max-w-[1200px] overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-black/10 lg:grid-cols-[1fr_1.1fr] animate-in fade-in zoom-in-95 duration-1000 ease-out"
                style={{ height: 'max(90vh, 700px)', maxHeight: '850px' }}
            >
                {/* Left Dark Panel - Antigravity Mesh Gradient */}
                <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-[#0A1526] p-12 text-center lg:flex">
                    {/* Deep Blue Base Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0E3F97] via-[#0B3682] to-[#05173A] opacity-90"></div>
                    
                    {/* Glassy Noise / Overlay */}
                    <div className="absolute inset-0 bg-white/5 mix-blend-overlay backdrop-blur-3xl"></div>
                    
                    {/* Antigravity Floating Glow Orbs */}
                    <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-[#3B82F6]/30 blur-[120px] animate-in fade-in zoom-in duration-1000 delay-300"></div>
                    <div className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-[#1D4ED8]/40 blur-[150px] animate-in fade-in zoom-in duration-1000 delay-500"></div>
                    <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#60A5FA]/20 blur-[100px] animate-in fade-in zoom-in duration-1000 delay-700"></div>
                    
                    <div className="relative z-10 flex max-w-sm flex-col items-center justify-center">
                        <img 
                            src="/img/LogoLogin.png" 
                            alt="Webcare Logo" 
                            className="mb-8 w-40 object-contain animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both"
                        />
                        
                        <h1 
                            className="font-sans text-[32px] font-semibold tracking-tight text-white/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both"
                        >
                            Mulai Karir Magang Anda <br />
                            <span className="font-bold text-white">Bersama Webcare</span>
                        </h1>
                        
                        <p 
                            className="mt-6 text-sm leading-relaxed text-white/70 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both"
                        >
                            Temukan pengalaman kerja nyata, tingkatkan keterampilan Anda,<br />
                            dan jadilah bagian dari inovasi teknologi bersama kami.
                        </p>
                    </div>
                </div>

                {/* Right Light Panel */}
                <div className="relative flex flex-col p-8 sm:p-12 lg:p-14">
                    {/* Top Bar */}
                    <div className="mb-12 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="/img/LogoLogin.png" alt="Webcare Logo" className="h-8 w-auto object-contain lg:hidden" />
                        </div>

                        {/* Top Right Link */}
                        <div className="text-sm text-[#131110]">
                            {isLogin ? (
                                <>
                                    Belum punya akun?{' '}
                                    <Link href="/register" className="font-semibold underline decoration-[#131110]/30 underline-offset-4 transition-colors hover:decoration-[#131110]">
                                        Daftar
                                    </Link>
                                </>
                            ) : (
                                <>
                                    Sudah punya akun?{' '}
                                    <Link href="/login" className="font-semibold underline decoration-[#131110]/30 underline-offset-4 transition-colors hover:decoration-[#131110]">
                                        Masuk
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-1 flex-col justify-center">
                        <div className="mx-auto w-full max-w-[400px]">
                            {children}
                        </div>
                    </div>

                    {/* Bottom Footer Area */}
                    <div className="mt-12 flex justify-between text-xs text-[#828282]">
                        <div>© 2024 Webcare</div>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-black">Kebijakan Privasi</Link>
                            <Link href="#" className="hover:text-black">Bantuan</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
