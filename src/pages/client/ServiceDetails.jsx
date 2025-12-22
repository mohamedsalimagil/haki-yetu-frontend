import React, { useState, useEffect } from 'react';// Import React and hooks for state and lifecycle
import { useParams, useNavigate } from 'react-router-dom';// Import routing hooks for params and navigation
import { Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';// Import icon components for UI
import api from '../../services/api';// Import API service for HTTP requests

const ServiceDetails = () => { // Define functional component for service details page
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate(); // Get navigation function for routing
