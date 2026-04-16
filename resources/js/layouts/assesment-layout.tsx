export default function AssesmentLayout({ children }: { children: React.ReactNode }) {
    // Layout-only wrapper: the take-assesment page handles its own top-bar & structure.
    return <div className="min-h-screen bg-[#EEF0F5]">{children}</div>;
}
