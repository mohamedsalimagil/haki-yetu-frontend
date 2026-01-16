export const getFullUrl = (path) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

<<<<<<< HEAD
    // Dynamically get API base from environment or fallback to localhost
=======
    // Dynamically get API base from environment or fallback to production backend
>>>>>>> c6bef946354cd3772866f076da7ae0a43f837442
    const apiBase = import.meta.env.VITE_API_BASE || 'https://haki-yetu-backend.onrender.com';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${apiBase}${cleanPath}`;
};
