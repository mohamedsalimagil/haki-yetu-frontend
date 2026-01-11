import os

APP_JSX = """import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/client/Dashboard';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Marketplace from './pages/client/Marketplace';
import Checkout from './pages/client/Checkout';
import Chat from './pages/client/Chat';
import ClientLayout from './components/layout/ClientLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      {/* Client Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><ClientLayout><Dashboard /></ClientLayout></ProtectedRoute>} />
      <Route path="/marketplace" element={<ProtectedRoute><ClientLayout><Marketplace /></ClientLayout></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><ClientLayout><Checkout /></ClientLayout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ClientLayout><Chat /></ClientLayout></ProtectedRoute>} />

      {/* Lawyer Routes */}
      <Route path="/lawyer/dashboard" element={<ProtectedRoute role="lawyer"><LawyerDashboard /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  );
}
export default App;
"""

CLIENT_LAYOUT = """import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, ShoppingBag, MessageSquare, LogOut, User } from 'lucide-react';

const ClientLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="h-16 flex items-center text-xl font-bold text-blue-800 px-4">Haki Yetu</div>
        <nav className="flex-1 space-y-2 mt-8">
            <button onClick={() => navigate('/dashboard')} className="flex gap-3 w-full p-3 hover:bg-blue-50 text-gray-700 rounded-lg"><LayoutDashboard size={20}/> Dashboard</button>
            <button onClick={() => navigate('/marketplace')} className="flex gap-3 w-full p-3 hover:bg-blue-50 text-gray-700 rounded-lg"><ShoppingBag size={20}/> Services</button>
            <button onClick={() => navigate('/chat')} className="flex gap-3 w-full p-3 hover:bg-blue-50 text-gray-700 rounded-lg"><MessageSquare size={20}/> Messages</button>
        </nav>
        <button onClick={() => {logout(); navigate('/login')}} className="flex gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg mt-auto"><LogOut size={20}/> Logout</button>
      </aside>
      <main className="flex-1 p-8">
        <div className="flex justify-end mb-8 items-center gap-3">
            <span className="font-bold">{user?.first_name}</span>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><User /></div>
        </div>
        {children}
      </main>
    </div>
  );
};
export default ClientLayout;
"""

DASHBOARD_JSX = """import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        api.get(`/marketplace/orders/user/${user.id}`).then(res => setOrders(res.data)).catch(console.error);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Welcome, {user?.first_name}</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold mb-4">Recent Orders</h3>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500"><tr><th className="p-3">Order #</th><th className="p-3">Service</th><th className="p-3">Amount</th><th className="p-3">Status</th></tr></thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-t border-gray-50">
                                <td className="p-3 font-mono text-sm">{o.order_number}</td>
                                <td className="p-3">{o.service_name}</td>
                                <td className="p-3 font-bold">KES {o.amount}</td>
                                <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{o.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default Dashboard;
"""

MARKETPLACE_JSX = """import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Marketplace = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/marketplace/services').then(res => setServices(res.data));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Legal Services</h1>
            <div className="grid grid-cols-3 gap-6">
                {services.map(s => (
                    <div key={s.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                        <div className="h-32 bg-blue-600 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-xl">{s.name[0]}</div>
                        <h3 className="font-bold text-lg">{s.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 h-10">{s.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">KES {s.price}</span>
                            <button onClick={() => navigate('/checkout', {state: s})} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Book Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Marketplace;
"""

CHECKOUT_JSX = """import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const Checkout = () => {
    const { state: service } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        try {
            await api.post('/marketplace/pay', { amount: service.price, service_name: service.name });
            toast.success("Payment Successful!");
            navigate('/dashboard');
        } catch (e) { toast.error("Failed"); setLoading(false); }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow mt-10">
            <h2 className="text-xl font-bold mb-6">Confirm Payment</h2>
            <div className="flex justify-between mb-4"><span>Service</span><span className="font-bold">{service?.name}</span></div>
            <div className="flex justify-between mb-8 border-t pt-4"><span>Total</span><span className="font-bold text-xl text-green-600">KES {service?.price}</span></div>
            <button onClick={handlePay} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
                {loading ? "Processing M-Pesa..." : "Pay with M-Pesa"}
            </button>
        </div>
    );
};
export default Checkout;
"""

LAWYER_DASH_JSX = """import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const LawyerDashboard = () => {
    const { logout } = useAuth();
    const [stats, setStats] = useState({});

    useEffect(() => {
        api.get('/lawyer/dashboard').then(res => setStats(res.data));
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between mb-8">
                <h1 className="text-2xl font-bold">Wakili Dashboard</h1>
                <button onClick={logout} className="text-red-600">Logout</button>
            </div>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow"><h3>Pending</h3><p className="text-3xl font-bold">{stats.pending_requests}</p></div>
                <div className="bg-white p-6 rounded shadow"><h3>Active</h3><p className="text-3xl font-bold">{stats.active_cases}</p></div>
                <div className="bg-white p-6 rounded shadow"><h3>Earnings</h3><p className="text-3xl font-bold">KES {stats.total_earnings}</p></div>
            </div>
        </div>
    );
};
export default LawyerDashboard;
"""

# ==========================================
# WRITE FUNCTION
# ==========================================
def install():
    print("🚀 Installing Full Frontend System...")
    
    files = {
        "src/App.jsx": APP_JSX,
        "src/components/layout/ClientLayout.jsx": CLIENT_LAYOUT,
        "src/pages/client/Dashboard.jsx": DASHBOARD_JSX,
        "src/pages/client/Marketplace.jsx": MARKETPLACE_JSX,
        "src/pages/client/Checkout.jsx": CHECKOUT_JSX,
        "src/pages/lawyer/LawyerDashboard.jsx": LAWYER_DASH_JSX,
    }

    for path, content in files.items():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(content)
        print(f"📄 Created: {path}")

    print("✅ Frontend Complete. Run 'npm run dev'")

if __name__ == "__main__":
    install()
    