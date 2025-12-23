import React, { useState, useEffect } from 'react'; // Import React and hooks for state and lifecycle
import api from '../../services/api'; // Import API service for HTTP requests
import { Package, Clock, FileText } from 'lucide-react'; // Import icon components for UI

const Dashboard = () => { // Define functional component for dashboard page
    const [orders, setOrders] = useState([]); // State for storing user's orders
    const [loading, setLoading] = useState(true); // State for tracking loading status

useEffect(() => { // Effect hook to fetch data on component mount
    const fetchOrders = async () => { // Async function to fetch user orders
        try { // Try block for error handling