import type { PositionStatItem } from '../../types';

export function PositionStatsGrid({ stats }: { stats: PositionStatItem[] }) {
    return (
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(({ Icon, label, value, iconCls, bgCls, bdCls }) => (
                <div
                    key={label}
                    className={`flex items-start gap-3 rounded-2xl border ${bdCls} ${bgCls} p-4`}
                >
                    <div className="shrink-0 rounded-xl bg-white/80 p-2 shadow-sm">
                        <Icon className={`h-4 w-4 ${iconCls}`} />
                    </div>
                    <div className="min-w-0">
                        <p className="mb-0.5 text-[10px] font-black tracking-wider text-[#7A849B] uppercase">
                            {label}
                        </p>
                        <p className="text-[13px] leading-snug font-bold text-[#0F1E46]">
                            {value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
