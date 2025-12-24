import React, { useState, useEffect } from 'react'; // Import React and hooks for state and lifecycle
import api from '../../services/api'; // Import API service for HTTP requests
import { Search, Filter, FileText, Check, XCircle } from 'lucide-react'; // Import icon components for UI

const OrderHistory = () => { // Define functional component for order history page
    const [orders, setOrders] = useState([]); // State for storing user's orders
    const [filter, setFilter] = useState('all'); // State for filter: all, completed, pending
    const [loading, setLoading] = useState(true); // State for tracking loading status

    useEffect(() => { // Effect hook to fetch data on component mount
        const fetchHistory = async () => { // Async function to fetch order history
            try { // Try block for error handling
                // Fetching all orders for User 1
                const response = await api.get('/marketplace/orders/user/1'); // API call to get orders for user ID 1

                setOrders(response.data); // Update state with fetched orders
                } catch (err) { // Catch block for error handling




