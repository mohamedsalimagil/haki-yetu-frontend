import os

# --- 1. CONTEXT & API ---
API_JS = """import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
"""

AUTH_CONTEXT = """import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
export default AuthContext;
"""

# --- 2. LAYOUTS ---
CLIENT_LAYOUT = """import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { LayoutDashboard, ShoppingBag, MessageSquare, LogOut, User } from 'lucide-react';

const ClientLayout = ({ children }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
                <div className="h-16 flex items-center px-2 text-xl font-bold text-blue-900">Haki Yetu</div>
                <nav className="flex-1 space-y-2 mt-6">
                    <button onClick={()=>navigate('/dashboard')} className="flex items-center gap-3 w-full p-3 hover:bg-blue-50 text-gray-700 rounded-lg"><LayoutDashboard size={20}/> Dashboard</button>
                    <button onClick={()=>navigate('/marketplace')} className="flex items-center gap-3 w-full p-3 hover:bg-blue-50 text-gray-700 rounded-lg"><ShoppingBag size={20}/> Services</button>
                    <button onClick={()=>navigate('/chat')} className="flex items-center gap-3 w-full p-3 hover:bg-blue-50 text-gray-700 rounded-lg"><MessageSquare size={20}/> Chat</button>
                </nav>
                <button onClick={logout} className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg mt-auto"><LogOut size={20}/> Logout</button>
            </aside>
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Portal</h2>
                    <div className="flex items-center gap-3">
                        <span className="font-medium">{user?.first_name}</span>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><User size={20}/></div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};
export default ClientLayout;
"""

# --- 3. PAGES ---
LOGIN_JSX = """import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.user, res.data.token);
            if (res.data.user.role === 'admin') navigate('/admin/dashboard');
            else if (res.data.user.role === 'lawyer') navigate('/lawyer/dashboard');
            else navigate('/dashboard');
        } catch (err) { alert('Login Failed'); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <input className="w-full mb-4 p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                <input className="w-full mb-6 p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
                <button className="w-full bg-blue-600 text-white p-2 rounded">Sign In</button>
            </form>
        </div>
    );
};
export default Login;
"""

DASHBOARD_JSX = """import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if(user) api.get(`/marketplace/orders/user/${user.id}`).then(res => setOrders(res.data));
    }, [user]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.first_name}</h1>
            <div className="bg-white p-6 rounded shadow">
                <h3 className="font-bold mb-4">Your Recent Orders</h3>
                {orders.length === 0 ? <p>No orders yet.</p> : (
                    <table className="w-full text-left">
                        <thead><tr className="border-b"><th className="p-2">Service</th><th className="p-2">Amount</th><th className="p-2">Status</th></tr></thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id} className="border-b">
                                    <td className="p-2">{o.service_name}</td>
                                    <td className="p-2">KES {o.amount}</td>
                                    <td className="p-2">{o.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
export default Dashboard;
"""

MARKETPLACE_JSX = """import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/marketplace/services').then(res => setServices(res.data));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(s => (
                <div key={s.id} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                    <h3 className="font-bold text-lg mb-2">{s.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 h-12">{s.description}</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="font-bold text-blue-900">KES {s.price}</span>
                        <button onClick={() => navigate('/checkout', {state: s})} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Book Now</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default Marketplace;
"""

CHECKOUT_JSX = """import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Checkout = () => {
    const { state: service } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        try {
            await api.post('/marketplace/pay', { amount: service.price, service_name: service.name });
            navigate('/dashboard');
        } catch (e) { alert('Payment Error'); setLoading(false); }
    };

    if (!service) return <div>Invalid Service</div>;

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow mt-10">
            <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
            <div className="mb-4">
                <p className="text-gray-500">Service</p>
                <p className="font-bold">{service.name}</p>
            </div>
            <div className="mb-6">
                <p className="text-gray-500">Amount</p>
                <p className="font-bold text-2xl text-green-600">KES {service.price}</p>
            </div>
            <button onClick={handlePay} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded font-bold">
                {loading ? "Processing..." : "Pay via M-Pesa"}
            </button>
        </div>
    );
};
export default Checkout;
"""

APP_JSX = """import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/client/Dashboard';
import Marketplace from './pages/client/Marketplace';
import Checkout from './pages/client/Checkout';
import Chat from './pages/client/Chat';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientLayout from './components/layout/ClientLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><ClientLayout><Dashboard /></ClientLayout></ProtectedRoute>} />
      <Route path="/marketplace" element={<ProtectedRoute><ClientLayout><Marketplace /></ClientLayout></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><ClientLayout><Checkout /></ClientLayout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ClientLayout><Chat /></ClientLayout></ProtectedRoute>} />

      <Route path="/lawyer/dashboard" element={<ProtectedRoute role="lawyer"><LawyerDashboard /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  );
}
export default App;
"""

def write_files():
    print("🚀 Building Robust Frontend...")
    
    files = {
        "src/services/api.js": API_JS,
        "src/context/AuthContext.jsx": AUTH_CONTEXT,
        "src/components/layout/ClientLayout.jsx": CLIENT_LAYOUT,
        "src/pages/auth/Login.jsx": LOGIN_JSX,
        "src/pages/client/Dashboard.jsx": DASHBOARD_JSX,
        "src/pages/client/Marketplace.jsx": MARKETPLACE_JSX,
        "src/pages/client/Checkout.jsx": CHECKOUT_JSX,
        "src/App.jsx": APP_JSX,
        # Placeholders for Admin/Lawyer/Chat to avoid import errors if not created yet
        "src/pages/lawyer/LawyerDashboard.jsx": "import React from 'react'; export default () => <div className='p-8'><h1>Lawyer Dashboard</h1></div>;",
        "src/pages/admin/AdminDashboard.jsx": "import React from 'react'; export default () => <div className='p-8'><h1>Admin Dashboard</h1></div>;",
        "src/pages/client/Chat.jsx": "import React from 'react'; export default () => <div className='p-8'><h1>Chat</h1></div>;",
        "src/hooks/useAuth.jsx": "import { useContext } from 'react'; import AuthContext from '../context/AuthContext'; const useAuth = () => useContext(AuthContext); export default useAuth;"
    }

    for path, content in files.items():
        directory = os.path.dirname(path)
        if directory:
            os.makedirs(directory, exist_ok=True)
            
        with open(path, "w") as f:
            f.write(content)
        print(f"✅ Generated: {path}")

if __name__ == "__main__":
    write_files()