import React from 'react';
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
