export const getFullUrl = (path) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    // CRITICAL: Force Backend Port 5000
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://127.0.0.1:5000${cleanPath}`;
};
