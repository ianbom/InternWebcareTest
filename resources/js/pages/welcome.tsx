import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ChevronDown, ChevronRight,
    Code2, PenTool, Megaphone,
    CheckCircle, Users,
    Briefcase, Award, Heart, Palette,
    GraduationCap, Rocket, Target, MessageSquare,
} from 'lucide-react';
import { WelcomeNavbar } from './welcome/components/WelcomeNavbar';
import { fadeIn, fadeUp, stagger } from './welcome/utils/motion';

// ─── Google Fonts: Plus Jakarta Sans ─────────────────────────────────────────
const fontLink = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap";

// ─── Data ─────────────────────────────────────────────────────────────────────
const tracks = [
    {
        icon: <Code2 className="w-6 h-6 text-white" />,
        bg: 'from-[#0E3F97] to-[#1B52B8]',
        label: 'Web Development',
        desc: 'Kuasai teknologi modern seperti React, Laravel, dan deployment berbasis cloud.',
        skills: ['React', 'Laravel', 'MySQL', 'Git'],
    },
    {
        icon: <PenTool className="w-6 h-6 text-white" />,
        bg: 'from-purple-600 to-purple-800',
        label: 'UI/UX Design',
        desc: 'Rancang tampilan website yang menarik, intuitif, dan berfokus pada pengguna.',
        skills: ['Figma', 'Prototyping', 'Wireframe', 'Design System'],
    },
    {
        icon: <Megaphone className="w-6 h-6 text-white" />,
        bg: 'from-emerald-500 to-emerald-700',
        label: 'Digital Marketing',
        desc: 'Pelajari strategi pemasaran digital untuk membantu bisnis klien berkembang.',
        skills: ['SEO', 'Social Media', 'Content', 'Analytics'],
    },
    {
        icon: <Palette className="w-6 h-6 text-white" />,
        bg: 'from-amber-500 to-orange-600',
        label: 'Graphic Designer',
        desc: 'Wujudkan ide kreatif dalam bentuk visual yang menarik untuk berbagai kampanye digital.',
        skills: ['Illustrator', 'Photoshop', 'Branding', 'Layouting'],
    },
];

const benefits = [
    { icon: <Briefcase className="w-5 h-5" />, title: 'Pengalaman Nyata', desc: 'Bekerja pada proyek klien sungguhan, bukan sekadar latihan.' },
    { icon: <GraduationCap className="w-5 h-5" />, title: 'Sertifikat Resmi', desc: 'Sertifikat internship diakui yang memperkuat CV Anda.' },
    { icon: <Users className="w-5 h-5" />, title: 'Mentoring 1-on-1', desc: 'Dibimbing langsung oleh profesional berpengalaman di bidangnya.' },
    { icon: <Rocket className="w-5 h-5" />, title: 'Portfolio Kuat', desc: 'Hasilkan karya nyata sebagai bukti kemampuan Anda.' },
    { icon: <Target className="w-5 h-5" />, title: 'Skill Industri', desc: 'Teknologi dan tools yang digunakan industri saat ini.' },
    { icon: <Heart className="w-5 h-5" />, title: 'Komunitas Solid', desc: 'Bergabung dalam komunitas alumni yang saling mendukung.' },
];

const faqs = [
    { q: 'Siapa yang bisa mendaftar program magang ini?', a: 'Mahasiswa aktif semester 3 ke atas dari semua jurusan, baik teknik, desain, bisnis, maupun ilmu komunikasi.' },
    { q: 'Apakah ada uang saku atau kompensasi?', a: 'Terdapat apresiasi berbasis performa untuk intern yang menyelesaikan program dengan baik. Detail akan diinformasikan saat interview.' },
    { q: 'Apakah bisa dilakukan secara remote?', a: 'Ya! Kami membuka opsi magang hybrid (remote & onsite di Malang). Sebagian besar aktivitas dapat dilakukan secara online.' },
    { q: 'Berapa lama durasi program magang?', a: 'Durasi standar 3-6 bulan disesuaikan kebutuhan akademik.' },
    { q: 'Apakah tersedia surat keterangan resmi?', a: 'Tentu! Kami menerbitkan surat keterangan magang, sertifikat kelulusan, dan dapat membantu penyediaan dokumen akademik yang diperlukan.' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Welcome() {
    return (
        <div
            className="min-h-screen bg-[#F5F7FB] text-[#0F1E46] overflow-x-hidden"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            <Head title="Program Magang Webcare.idn — Internship Digital Terbaik">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href={fontLink} rel="stylesheet" />
            </Head>

            {/* ── Header Nav ────────────────────────────────────────────── */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E3E8F2] shadow-sm">
                <WelcomeNavbar />
            </div>

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden pt-20 pb-32">
                {/* BG blobs */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8F0FF] rounded-full -translate-y-1/3 translate-x-1/4 opacity-70" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#EEF1FB] rounded-full translate-y-1/3 -translate-x-1/4 opacity-60" />
                    {/* Dot grid */}
                    <div className="absolute top-20 left-16 grid grid-cols-8 gap-4 opacity-[0.12]">
                        {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0E3F97]" />
                        ))}
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-8 lg:px-16 flex flex-col lg:flex-row items-center gap-16">

                    {/* Left: Headline */}
                    <motion.div
                        className="w-full lg:w-1/2"
                        initial="hidden" animate="visible" variants={stagger}
                    >
                      

                        <motion.h1 variants={fadeUp} className="text-5xl lg:text-[62px] font-extrabold leading-[1.1] tracking-tight mb-6">
                            Mulai Karirmu{' '}
                            <span className="relative text-[#0E3F97]">
                                Bersama Kami
                                <svg className="absolute w-full h-2.5 -bottom-1 left-0 text-[#78A0FF]/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 8 Q 50 2 100 8" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeUp} className="text-[#65708C] text-lg leading-relaxed max-w-lg mb-10">
                            Program internship intensif 3-6 bulan di <strong className="text-[#0F1E46]">Webcare.idn</strong>. Kerjakan proyek klien nyata, miliki portfolio kuat, dan dapatkan sertifikat yang diakui industri.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                            <a
                                href="#daftar"
                                className="w-full sm:w-auto bg-gradient-to-r from-[#0E3F97] to-[#1B52B8] text-white px-8 py-4 rounded-2xl font-bold text-base shadow-[0_12px_32px_rgba(14,63,151,0.35)] hover:shadow-[0_16px_40px_rgba(14,63,151,0.45)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Rocket className="w-5 h-5" /> Daftar Magang Sekarang
                            </a>
                            <a
                                href="#program"
                                className="w-full sm:w-auto text-[#0E3F97] font-bold px-8 py-4 rounded-2xl border-2 border-[#0E3F97]/20 bg-[#E8EEF9] hover:border-[#0E3F97]/40 hover:bg-[#dce8ff] transition-all duration-300 flex items-center justify-center gap-2 text-base"
                            >
                                Lihat Program <ChevronDown className="w-4 h-4" />
                            </a>
                        </motion.div>

                        {/* Stats */}
                        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6 max-w-md">
                            {[
                                { value: '200+', label: 'Alumni Magang' },
                                { value: '12', label: 'Batch Selesai' },
                                { value: '95%', label: 'Langsung Kerja' },
                            ].map((s) => (
                                <div key={s.label} className="text-center">
                                    <div className="text-3xl font-extrabold text-[#0E3F97]">{s.value}</div>
                                    <div className="text-xs font-semibold text-[#7A849B] mt-1">{s.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right: Image Collage */}
                    <div className="w-full lg:w-1/2 relative h-[500px] hidden lg:block">
                        {/* Main card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2 }}
                            className="absolute top-0 right-0 w-[430px] h-[320px] rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(14,63,151,0.18)] border-[6px] border-white"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800"
                                className="w-full h-full object-cover" alt="Interns collaborating"
                            />
                        </motion.div>

                        {/* Secondary card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.45 }}
                            className="absolute bottom-0 left-0 w-[320px] h-[240px] rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(14,63,151,0.14)] border-[6px] border-white"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800"
                                className="w-full h-full object-cover" alt="Mentoring session"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Divisi / Track ────────────────────────────────────────── */}
            <section id="program" className="py-24 bg-white">
                <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={stagger} className="text-center mb-16"
                    >
                        <motion.span variants={fadeUp} className="inline-block bg-[#E8EEF9] text-[#0E3F97] text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
                            Pilih Divisi
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-[#0F1E46] mb-4">
                            4 Track Program Magang
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-[#65708C] text-base max-w-xl mx-auto">
                            Pilih jalur yang paling sesuai dengan minat dan tujuan karir Anda.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {tracks.map((t, i) => (
                            <motion.div
                                variants={fadeUp} key={i}
                                className="bg-[#F5F7FB] rounded-2xl p-7 border border-[#E3E8F2] hover:shadow-[0_20px_50px_rgba(14,63,151,0.12)] hover:-translate-y-2 hover:border-[#78A0FF] transition-all duration-400 group cursor-pointer will-change-transform"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.bg} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {t.icon}
                                </div>
                                <h3 className="font-bold text-[#0F1E46] text-lg mb-3 group-hover:text-[#0E3F97] transition-colors">{t.label}</h3>
                                <p className="text-[#65708C] text-sm font-medium leading-relaxed mb-5">{t.desc}</p>
                                <div className="flex flex-wrap gap-2">
                                    {t.skills.map((s) => (
                                        <span key={s} className="bg-white text-[#65708C] border border-[#E3E8F2] text-[11px] font-bold px-2.5 py-1 rounded-lg group-hover:border-[#78A0FF] group-hover:text-[#0E3F97] transition-colors">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Benefits ──────────────────────────────────────────────── */}
            <section id="manfaat" className="py-24 bg-[#F5F7FB]">
                <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={stagger} className="flex flex-col lg:flex-row gap-16 items-center"
                    >
                        {/* Left: image */}
                        <motion.div variants={fadeIn} className="w-full lg:w-[45%] relative">
                            <div className="rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(14,63,151,0.15)] border-[6px] border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=700"
                                    className="w-full h-[400px] object-cover" alt="Team collaboration"
                                />
                            </div>
                            {/* overlay badge */}
                            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-[0_12px_40px_rgba(14,63,151,0.12)] border border-[#E3E8F2] p-5 flex items-center gap-3">
                                <div className="bg-[#E8EEF9] p-2.5 rounded-xl">
                                    <Award className="w-6 h-6 text-[#0E3F97]" />
                                </div>
                                <div>
                                    <div className="text-base font-extrabold text-[#0F1E46]">Sertifikat Resmi</div>
                                    <div className="text-xs font-semibold text-[#7A849B]">Diakui Industri</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: benefits list */}
                        <div className="w-full lg:w-[55%]">
                            <motion.span variants={fadeUp} className="inline-block bg-[#E8EEF9] text-[#0E3F97] text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-5">
                                Manfaat Program
                            </motion.span>
                            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-[#0F1E46] mb-4">
                                Mengapa Magang di Webcare.idn?
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-[#65708C] text-base mb-10 leading-relaxed">
                                Kami tidak hanya memberi tugas administrasi. Anda akan belajar dan bekerja seperti karyawan sungguhan dalam lingkungan yang suportif.
                            </motion.p>

                            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {benefits.map((b, i) => (
                                    <motion.div
                                        variants={fadeUp} key={i}
                                        className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-[#E3E8F2] shadow-sm hover:shadow-[0_12px_30px_rgba(14,63,151,0.1)] hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="bg-[#E8EEF9] p-2.5 rounded-xl text-[#0E3F97] shrink-0">
                                            {b.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0F1E46] mb-1">{b.title}</h4>
                                            <p className="text-[#65708C] text-sm font-medium leading-relaxed">{b.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Curriculum Timeline ───────────────────────────────────── */}
            {/* <section id="kurikulum" className="py-24 bg-white">
                <div className="max-w-[900px] mx-auto px-8 lg:px-16">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={stagger} className="text-center mb-16"
                    >
                        <motion.span variants={fadeUp} className="inline-block bg-[#E8EEF9] text-[#0E3F97] text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
                            Kurikulum
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-[#0F1E46] mb-4">
                            Alur Program 12 Minggu
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-[#65708C] text-base">
                            Program terstruktur yang dirancang agar Anda siap kerja di hari pertama lulus.
                        </motion.p>
                    </motion.div>

                    <div className="relative">
                  
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#E3E8F2] hidden sm:block" />

                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                            variants={stagger} className="space-y-6"
                        >
                            {curriculum.map((item, i) => (
                                <motion.div variants={fadeUp} key={i} className="relative flex gap-6 sm:pl-16">
                                   
                                    <div className="hidden sm:flex absolute left-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#0E3F97] to-[#1B52B8] items-center justify-center text-white text-xs font-extrabold shadow-[0_4px_14px_rgba(14,63,151,0.3)] shrink-0">
                                        {String(i + 1).padStart(2, '0')}
                                    </div>
                                    <div className="bg-[#F5F7FB] rounded-2xl p-6 border border-[#E3E8F2] hover:border-[#78A0FF] hover:shadow-[0_8px_24px_rgba(14,63,151,0.08)] transition-all duration-300 flex-1">
                                        <div className="text-xs font-bold text-[#0E3F97] uppercase tracking-widest mb-1">{item.week}</div>
                                        <h3 className="font-bold text-[#0F1E46] text-lg mb-1">{item.title}</h3>
                                        <p className="text-[#65708C] text-sm font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section> */}

            {/* ── Testimonials ──────────────────────────────────────────── */}
            {/* <section id="testimoni" className="py-24 bg-[#F5F7FB]">
                <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={stagger} className="text-center mb-16"
                    >
                        <motion.span variants={fadeUp} className="inline-block bg-[#E8EEF9] text-[#0E3F97] text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
                            Testimoni
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-[#0F1E46] mb-4">
                            Cerita dari Alumni Intern
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-[#65708C] text-base max-w-xl mx-auto">
                            Lebih dari 200 intern telah lulus dan membuktikan dampak nyata program ini.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {testimonials.map((t, i) => (
                            <motion.div
                                variants={fadeUp} key={i}
                                className="bg-white rounded-2xl p-8 border border-[#E3E8F2] shadow-sm hover:shadow-[0_20px_50px_rgba(14,63,151,0.1)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col"
                            >
                                <div className="flex gap-1 mb-5">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>

                                <p className="text-[#65708C] text-sm font-medium leading-relaxed mb-7 flex-1">
                                    &ldquo;{t.quote}&rdquo;
                                </p>

                                <div className="flex items-center gap-3 pt-5 border-t border-[#E3E8F2]">
                                    <div className={`w-11 h-11 rounded-xl ${t.color} flex items-center justify-center text-white text-sm font-extrabold shadow-sm`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#0F1E46] text-sm">{t.name}</div>
                                        <div className="text-[12px] font-semibold text-[#7A849B]">{t.role} · {t.univ}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section> */}

            {/* ── CTA: Daftar ───────────────────────────────────────────── */}
            <section id="daftar" className="py-24 bg-gradient-to-br from-[#0E3F97] to-[#1B52B8] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none -z-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                </div>

                <div className="max-w-[700px] mx-auto px-8 text-center relative z-10">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={stagger}
                    >
                        <motion.span variants={fadeUp} className="inline-block bg-white/15 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-6">
                            Pendaftaran Batch Mei 2026
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white mb-5">
                            Siap Mulai Perjalananmu?
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-blue-200 text-base mb-10 leading-relaxed">
                            Slot terbatas untuk 20 peserta per batch. Daftar sekarang dan jadilah bagian dari komunitas intern Webcare.idn yang terus berkembang.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                            <Link
                                href="/register"
                                className="w-full sm:w-auto bg-white text-[#0E3F97] font-bold px-10 py-4 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-base"
                            >
                                <GraduationCap className="w-5 h-5" /> Daftar Sekarang — Gratis
                            </Link>
                            <a
                                href="https://wa.me/6285736426304"
                                target="_blank"
                                className="w-full sm:w-auto text-white font-bold px-10 py-4 rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-base"
                            >
                                <MessageSquare className="w-5 h-5" /> Tanya via WhatsApp
                            </a>
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 text-sm font-semibold text-blue-200">
                            {['Gratis Pendaftaran', 'Sertifikat Resmi', 'Remote Friendly'].map((item) => (
                                <span key={item} className="flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-emerald-300" /> {item}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────────────────── */}
            <section id="faq" className="py-24 bg-white">
                <div className="max-w-[800px] mx-auto px-8 lg:px-16">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={stagger} className="text-center mb-16"
                    >
                        <motion.span variants={fadeUp} className="inline-block bg-[#E8EEF9] text-[#0E3F97] text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
                            FAQ
                        </motion.span>
                        <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-[#0F1E46]">
                            Pertanyaan Umum
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                        variants={stagger} className="space-y-4"
                    >
                        {faqs.map((faq, i) => (
                            <motion.details
                                variants={fadeUp} key={i}
                                className="group bg-[#F5F7FB] rounded-2xl border border-[#E3E8F2] overflow-hidden"
                            >
                                <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer font-bold text-[#0F1E46] text-base list-none hover:text-[#0E3F97] transition-colors">
                                    {faq.q}
                                    <ChevronRight className="w-5 h-5 text-[#7A849B] shrink-0 group-open:rotate-90 transition-transform duration-300" />
                                </summary>
                                <div className="px-6 pb-6 text-[#65708C] text-sm font-medium leading-relaxed border-t border-[#E3E8F2] pt-4">
                                    {faq.a}
                                </div>
                            </motion.details>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────────── */}
            <footer className="bg-[#0F1E46] pt-16 pb-8">
                <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
                        {/* Brand */}
                        <div className="max-w-xs">
                            <div className="flex items-center gap-2 mb-4">
                                <img src="/img/HomeWebcare.png" alt="Webcare.idn Logo" className="h-[100px] lg:h-[120px] w-auto object-contain -my-10 brightness-0 invert origin-left" />
                            </div>
                            <p className="text-[#7A849B] text-sm leading-relaxed">
                                Platform digital yang membantu UMKM naik kelas. Program internship kami hadir untuk mencetak talenta digital masa depan.
                            </p>
                        </div>

                        {/* Quick links */}
                        <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                            {[
                                { href: '#program', label: 'Program Magang' },
                                { href: '#manfaat', label: 'Manfaat' },
                                { href: '#daftar', label: 'Daftar Sekarang' },
                                { href: '#faq', label: 'FAQ' },
                            ].map((link) => (
                                <a key={link.href} href={link.href} className="text-[#7A849B] hover:text-white text-sm font-semibold transition-colors">
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Kontak</h4>
                            <a href="https://wa.me/6285736426304" className="text-[#7A849B] hover:text-white text-sm font-semibold block mb-2 transition-colors">
                                📞 +62 857-3642-6304
                            </a>
                            <a href="https://webcareidn.com" className="text-[#7A849B] hover:text-white text-sm font-semibold block transition-colors">
                                🌐 webcareidn.com
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#65708C]">
                        <p>© 2026 Webcare.idn. Hak Cipta Dilindungi.</p>
                        <div className="flex items-center gap-5">
                            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
