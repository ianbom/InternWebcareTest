type AssessmentEmptyStateProps = {
    text: string;
};

export function AssessmentEmptyState({ text }: AssessmentEmptyStateProps) {
    return (
        <div className="rounded-3xl border border-dashed border-[#C9D5EA] bg-[#F9FBFF] px-5 py-10 text-center text-sm font-semibold text-[#6B7894]">
            {text}
        </div>
    );
}
