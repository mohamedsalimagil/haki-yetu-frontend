export const getFullUrl = (path) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

    // Dynamically get API base from environment or fallback to production backend
    const apiBase = import.meta.env.VITE_API_BASE || 'https://haki-yetu-backend.onrender.com';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${apiBase}${cleanPath}`;
};
