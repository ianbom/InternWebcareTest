type FieldErrorProps = {
    message?: string;
};

export function FieldError({ message }: FieldErrorProps) {
    if (!message) {
        return null;
    }

    return <p className="mt-1 text-xs font-semibold text-rose-600">{message}</p>;
}
