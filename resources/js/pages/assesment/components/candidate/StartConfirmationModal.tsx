import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Shield,
    Timer,
    Wifi,
} from 'lucide-react';

type StartConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function StartConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
}: StartConfirmationModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 shadow-2xl backdrop-blur-sm transition-all">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-4 border-b border-primary/10 bg-primary/5 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-primary/20">
                        <AlertTriangle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Peraturan Assessment
                        </h3>
                        <p className="text-sm font-medium text-primary">
                            Harap baca dengan teliti sebelum memulai
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-4 text-sm text-gray-600">
                        <div className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                            <p>
                                <strong className="text-gray-800">
                                    Gunakan Google Chrome:
                                </strong>{' '}
                                Pastikan Anda menggunakan browser Google Chrome
                                versi terbaru untuk pengalaman quiz yang stabil
                                dan optimal.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Shield className="h-5 w-5 shrink-0 text-amber-500" />
                            <p>
                                <strong className="text-gray-800">
                                    Sistem Anti-Kecurangan Aktif:
                                </strong>{' '}
                                Jangan melakukan refresh halaman atau mencoba
                                membuka tab baru. Segala bentuk aktivitas
                                mencurigakan seperti berpindah tab, minimize
                                browser, atau menggunakan shortcut akan tercatat
                                otomatis.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Timer className="h-5 w-5 shrink-0 text-rose-500" />
                            <p>
                                <strong className="text-gray-800">
                                    Waktu Mulai Berjalan:
                                </strong>{' '}
                                Setelah tombol "Mulai Quiz Sekarang" diklik,
                                waktu quiz akan langsung berjalan dan tidak bisa
                                dijeda.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Wifi className="h-5 w-5 shrink-0 text-blue-500" />
                            <p>
                                <strong className="text-gray-800">
                                    Koneksi Internet:
                                </strong>{' '}
                                Pastikan koneksi internet Anda stabil sebelum
                                memulai untuk menghindari kegagalan penyimpanan
                                jawaban.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 bg-gray-50/80 p-6 sm:flex-row">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-5 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onConfirm();
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    >
                        Mulai Quiz Sekarang
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
