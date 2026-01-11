import os

USE_AUTH_JSX = """import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// 1. Export as a Named Export (Fixes your specific error)
export const useAuth = () => {
    return useContext(AuthContext);
};

// 2. Export as Default (Fixes other files using default import)
export default useAuth;
"""

def fix():
    print("🛠 Fixing useAuth Hook exports...")
    os.makedirs("src/hooks", exist_ok=True)
    with open("src/hooks/useAuth.jsx", "w") as f:
        f.write(USE_AUTH_JSX)
    print("✅ Fixed: src/hooks/useAuth.jsx now supports both import styles.")

if __name__ == "__main__":
    fix()