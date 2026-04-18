import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function WelcomeNavbar() {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-50 mx-auto flex w-full max-w-[1400px] items-center justify-between px-8 py-5 lg:px-16"
        >
            <div className="flex cursor-pointer items-center gap-2.5">
                <img src="/img/HomeWarna.png" alt="Webcare.idn Logo" className="h-[100px] lg:h-[120px] w-auto object-contain -my-10" />
            </div>

            <div className="hidden items-center gap-8 text-[14px] font-semibold text-[#65708C] lg:flex">
                {['Program', 'Manfaat', 'Kurikulum', 'Testimoni', 'FAQ'].map(
                    (item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="transition-colors duration-200 hover:text-[#0E3F97]"
                        >
                            {item}
                        </a>
                    ),
                )}
            </div>

            <div className="flex items-center gap-4 text-[14px] font-semibold">
                <Link
                    href="/login"
                    className="hidden text-[#65708C] transition-colors hover:text-[#0E3F97] md:block"
                >
                    Login
                </Link>
                <a
                    href="#daftar"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0E3F97] to-[#1B52B8] px-6 py-2.5 text-white shadow-[0_8px_20px_rgba(14,63,151,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(14,63,151,0.45)]"
                >
                    Daftar Sekarang <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </motion.nav>
    );
}
