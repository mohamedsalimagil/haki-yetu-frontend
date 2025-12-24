import React, { useState, useEffect } from 'react'; // Import React and hooks for state and lifecycle
import api from '../../services/api'; // Import API service for HTTP requests
import { Search, Filter, FileText, Check, XCircle } from 'lucide-react'; // Import icon components for UI

const OrderHistory = () => { // Define functional component for order history page