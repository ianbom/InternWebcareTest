type ScoreBadgeProps = {
    score: number | null;
};

export function ScoreBadge({ score }: ScoreBadgeProps) {
    return (
        <span className="text-2xl font-black text-[#1D449C]">
            {score ?? '-'}
        </span>
    );
}
