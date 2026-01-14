export const getFullUrl = (path) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

    // Dynamically get API base from environment or fallback to localhost
    const apiBase = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${apiBase}${cleanPath}`;
};
