export function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="text-xs font-semibold text-rose-600">{message}</p>;
}
