type DashboardHeroProps = {
    candidateName: string;
};

export function DashboardHero({ candidateName }: DashboardHeroProps) {
    return (
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E3F97] to-[#1B52B8] shadow-[0_10px_28px_rgba(15,62,148,0.25)]">
            <div className="grid min-h-[170px] md:grid-cols-[minmax(0,1fr)_154px]">
                <div className="p-7">
                    <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white">
                        Selamat Datang, {candidateName}!
                    </h1>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-blue-100">
                        Satu langkah lagi menuju karir impianmu. Mari selesaikan
                        assessment hari ini.
                    </p>
                </div>
            </div>
        </div>
    );
}
