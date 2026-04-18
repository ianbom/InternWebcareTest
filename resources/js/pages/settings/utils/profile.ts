export function getCvDisplay(path: string | null): {
    name?: string;
    url: string | null;
} {
    if (!path) {
        return { url: null };
    }

    return {
        name: path.split('/').pop(),
        url: `/storage/${path
            .split('/')
            .map((segment) => encodeURIComponent(segment))
            .join('/')}`,
    };
}
