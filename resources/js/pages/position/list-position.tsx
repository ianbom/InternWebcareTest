import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface Position {
    id: number;
    title: string;
    description: string | null;
}

interface Props {
    positions: Position[] | { data?: Position[] } | null;
    hasAppliedPosition: boolean;
}

export default function ListPosition({ positions, hasAppliedPosition }: Props) {
    // Normalize positions — handle plain array, paginated object, or null
    const positionList: Position[] = Array.isArray(positions)
        ? positions
        : Array.isArray((positions as { data?: Position[] } | null)?.data)
          ? ((positions as { data: Position[] }).data)
          : [];

    return (
        <AppLayout>
            <Head title="Posisi Magang - InternHub" />

            <div className="relative isolate px-4 py-12 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
                {/* Antigravity Decorative Background */}
                <div
                    className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-80"
                />

                {/* Header */}
                <div className="mb-14 text-center max-w-2xl mx-auto space-y-4">
                    <Badge
                        variant="outline"
                        className="animate-in fade-in slide-in-from-top-4 duration-700 ease-out border-primary/20 text-primary bg-primary/5 py-1 px-3"
                    >
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        Peluang InternHub Terbaru
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight animate-in fade-in slide-in-from-top-8 duration-700 delay-100 ease-out">
                        Temukan Peran{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                            Terbaikmu
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg animate-in fade-in slide-in-from-top-8 duration-700 delay-200 ease-out">
                        Pilih posisi magang yang sesuai dengan minat dan kembangkan karirmu bersama kami.
                    </p>
                </div>

                {/* Already Applied Banner */}
                {hasAppliedPosition && (
                    <div className="mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <p className="text-primary text-center font-medium">
                                Anda sudah mendaftar pada sebuah posisi. Selesaikan proses seleksi atau pantau status
                                lamaran di dashboard.
                            </p>
                        </div>
                    </div>
                )}

                {/* Position Grid */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    style={{ perspective: '1000px' }}
                >
                    {positionList.length > 0 ? (
                        positionList.map((position, index) => (
                            <div
                                key={position.id}
                                className="group animate-in fade-in zoom-in-95 fill-mode-forwards"
                                style={{
                                    animationDelay: `${(index + 3) * 100}ms`,
                                    animationDuration: '800ms',
                                }}
                            >
                                <Card className="h-full flex flex-col transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(29,68,156,0.12)] bg-card/80 backdrop-blur-xl border-border/50 hover:border-primary/30 relative overflow-hidden">
                                    {/* Glassmorphism shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none dark:from-white/5" />

                                    <CardHeader className="relative z-10 pb-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-500 ease-out">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                                            {position.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="relative z-10 flex-grow pt-2">
                                        <CardDescription className="text-base leading-relaxed line-clamp-3">
                                            {position.description || 'Tidak ada deskripsi tersedia untuk posisi ini.'}
                                        </CardDescription>
                                    </CardContent>

                                    <CardFooter className="relative z-10 pt-6 mt-auto">
                                        <Button
                                            asChild={!hasAppliedPosition}
                                            disabled={hasAppliedPosition}
                                            className="w-full rounded-xl h-11 transition-all duration-300 hover:shadow-[0_0_20px_rgba(29,68,156,0.3)] hover:scale-[1.02]"
                                        >
                                            {hasAppliedPosition ? (
                                                <span className="opacity-70">Sudah Mendaftar</span>
                                            ) : (
                                                <Link href={`/positions/${position.id}`}>
                                                    Daftar Sekarang
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center animate-in fade-in duration-700 fill-mode-forwards">
                            <div className="max-w-md mx-auto p-8 rounded-3xl border border-dashed border-border bg-card/40 backdrop-blur-sm">
                                <Briefcase className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Belum Ada Posisi Tersedia</h3>
                                <p className="text-muted-foreground">
                                    Silakan kembali lagi nanti untuk melihat posisi magang yang sedang dibuka.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
