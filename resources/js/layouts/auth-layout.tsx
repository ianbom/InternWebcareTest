import OrionAuthLayout from '@/layouts/auth/orion-auth-layout';

export default function AuthLayout({
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <OrionAuthLayout>
            {children}
        </OrionAuthLayout>
    );
}
