import { Users } from 'lucide-react';

export function SelectionFlowStepper({ flow }: { flow: string[] }) {
    return (
        <div className="mb-6 rounded-2xl border border-[#E3E8F2] bg-[#F8FAFE] px-6 py-5">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-black tracking-wide text-[#0F1E46] uppercase">
                <Users className="h-4 w-4 text-[#0E3F97]" />
                Alur Seleksi
            </h3>

            <div className="relative grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
                <div className="absolute top-5 right-[calc(12.5%+20px)] left-[calc(12.5%+20px)] hidden h-px bg-[#DCE2EE] sm:block" />

                {flow.map((step, index) => (
                    <div
                        key={step}
                        className="relative z-10 flex flex-col items-center gap-2.5 text-center"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E3F97] text-[13px] font-black text-white shadow-[0_4px_12px_rgba(14,63,151,0.3)]">
                            {index + 1}
                        </div>
                        <p className="max-w-[96px] text-[12px] leading-snug font-semibold text-[#65708C]">
                            {step}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
