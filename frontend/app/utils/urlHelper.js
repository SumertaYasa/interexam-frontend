export const getPhotoUrl = (path) => {

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const IMAGE_BASE_URL = API_BASE_URL.replace('/api/v1', '');

    if (!path) return "/profile-default.png";

    const normalizedPath = path.replace(/\\/g, '/');

    if (normalizedPath.includes('uploads/')) {
         const relativePath = normalizedPath.split('uploads/')[1];
         return `${IMAGE_BASE_URL}/uploads/${relativePath}`;
    }
    
    return "/profile-default.png"; 
};