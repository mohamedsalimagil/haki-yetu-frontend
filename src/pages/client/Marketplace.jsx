import React, { useEffect, useState } from 'react';
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
