export function PositionHero() {
    return (
        <section className="overflow-hidden rounded-[32px] bg-[#102B5C] text-white shadow-[0_28px_80px_rgba(16,43,92,0.24)]">
            <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
                <div>
                    <p className="text-xs font-bold tracking-[0.28em] text-[#8FB4FF] uppercase">
                        Admin Workspace
                    </p>
                    <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                        Position Management
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100">
                        Kelola posisi magang, status aktif, dan deskripsi
                        lowongan yang akan dilihat kandidat.
                    </p>
                </div>
            </div>
        </section>
    );
}
