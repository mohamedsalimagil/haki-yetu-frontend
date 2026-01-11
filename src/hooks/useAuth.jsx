import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// 1. Export as a Named Export (Fixes your specific error)
export const useAuth = () => {
    return useContext(AuthContext);
};

// 2. Export as Default (Fixes other files using default import)
export default useAuth;
