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
                {/* Left Dark Panel */}
                <div className="relative hidden flex-col items-center justify-center bg-gradient-to-br from-[#0E3F97] to-[#1B52B8] p-12 text-center lg:flex">
                    <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                    <div className="absolute top-1/4 -right-20 h-64 w-64 rounded-full bg-[#78A0FF]/25 blur-3xl"></div>
                    
                    <div className="relative z-10 flex max-w-sm flex-col items-center justify-center">
                        <div 
                            className="mb-8 flex size-24 items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both"
                            style={{
                                background: 'linear-gradient(135deg, #1B52B8, #0B3682)',
                                borderRadius: '28%',
                            }}
                        >
                            <svg viewBox="0 0 100 100" className="size-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M50 82C67.6731 82 82 67.6731 82 50C82 32.3269 67.6731 18 50 18C44.3312 18 39.006 19.4754 34.3411 22.0151C32.1867 23.1878 31.3789 25.897 32.5516 28.0514C33.7243 30.2057 36.4336 31.0135 38.5879 29.8409C41.9791 27.9942 45.8673 26.9634 50 26.9634C62.723 26.9634 73.0366 37.277 73.0366 50C73.0366 62.723 62.723 73.0366 50 73.0366C37.277 73.0366 26.9634 62.723 26.9634 50C26.9634 45.4764 28.2662 41.2562 30.4952 37.6698C31.761 35.6334 31.1396 32.9537 29.1032 31.6879C27.0668 30.4222 24.3871 31.0436 23.1213 33.08C20.1585 37.8488 18.439 43.7259 18.439 50C18.439 67.6731 32.7483 82 50 82Z" fill="white" />
                                <path d="M49.5 28C61.6503 28 71.5 37.8497 71.5 50C71.5 53.0792 70.8665 56.0097 69.7188 58.6833L53.9452 42.9097C52.7915 41.756 50.921 41.756 49.7673 42.9097L40.8167 51.8603C41.2464 43.1873 48.4093 36.1951 57.25 36.1951C58.3546 36.1951 59.25 35.2996 59.25 34.1951C59.25 33.0905 58.3546 32.1951 57.25 32.1951C47.4116 32.1951 38.8354 40.1593 37.1983 50H32C32 37.8497 39.8497 28 49.5 28Z" fill="#78A0FF" />
                            </svg>
                        </div>
                        
                        <h1 
                            className="font-sans text-[32px] font-semibold tracking-tight text-white/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both"
                        >
                            One Platform to Streamline <br />
                            <span className="font-bold text-white">All Product Analytics</span>
                        </h1>
                        
                        <p 
                            className="mt-6 text-sm leading-relaxed text-white/50 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both"
                        >
                            Your revenue are set to grow by 20% next month. Your revenue<br />
                            is increase by next month with our campaign tools.
                        </p>
                        
                        <div className="mt-12 flex gap-2 animate-in fade-in duration-1000 delay-700 fill-mode-both">
                            <div className="size-1.5 rounded-full bg-white"></div>
                            <div className="size-1.5 rounded-full bg-white/20"></div>
                            <div className="size-1.5 rounded-full bg-white/20"></div>
                        </div>
                    </div>
                </div>

                {/* Right Light Panel */}
                <div className="relative flex flex-col p-8 sm:p-12 lg:p-14">
                    {/* Top Bar */}
                    <div className="mb-12 flex items-center justify-between">
                        {/* Mobile Logo / Dark logo */}
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-full bg-[#0E3F97]">
                                <svg viewBox="0 0 100 100" className="size-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M50 82C67.6731 82 82 67.6731 82 50C82 32.3269 67.6731 18 50 18C44.3312 18 39.006 19.4754 34.3411 22.0151C32.1867 23.1878 31.3789 25.897 32.5516 28.0514C33.7243 30.2057 36.4336 31.0135 38.5879 29.8409C41.9791 27.9942 45.8673 26.9634 50 26.9634C62.723 26.9634 73.0366 37.277 73.0366 50C73.0366 62.723 62.723 73.0366 50 73.0366C37.277 73.0366 26.9634 62.723 26.9634 50C26.9634 45.4764 28.2662 41.2562 30.4952 37.6698C31.761 35.6334 31.1396 32.9537 29.1032 31.6879C27.0668 30.4222 24.3871 31.0436 23.1213 33.08C20.1585 37.8488 18.439 43.7259 18.439 50C18.439 67.6731 32.7483 82 50 82Z" fill="white" />
                                    <path d="M49.5 28C61.6503 28 71.5 37.8497 71.5 50C71.5 53.0792 70.8665 56.0097 69.7188 58.6833L53.9452 42.9097C52.7915 41.756 50.921 41.756 49.7673 42.9097L40.8167 51.8603C41.2464 43.1873 48.4093 36.1951 57.25 36.1951C58.3546 36.1951 59.25 35.2996 59.25 34.1951C59.25 33.0905 58.3546 32.1951 57.25 32.1951C47.4116 32.1951 38.8354 40.1593 37.1983 50H32C32 37.8497 39.8497 28 49.5 28Z" fill="#78A0FF" />
                                </svg>
                            </div>
                        </div>

                        {/* Top Right Link */}
                        <div className="text-sm text-[#131110]">
                            {isLogin ? (
                                <>
                                    Don't have an account?{' '}
                                    <Link href="/register" className="font-semibold underline decoration-[#131110]/30 underline-offset-4 transition-colors hover:decoration-[#131110]">
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <Link href="/login" className="font-semibold underline decoration-[#131110]/30 underline-offset-4 transition-colors hover:decoration-[#131110]">
                                        Log In
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
                            <Link href="#" className="hover:text-black">Privacy Policy</Link>
                            <Link href="#" className="hover:text-black">Support</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
