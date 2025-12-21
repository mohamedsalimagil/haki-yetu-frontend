import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ServiceCard from '../../components/domain/marketplace/ServiceCard';
import { Search } from 'lucide-react';

const ServiceCatalog = () => { 
    const [services, setServices] = useState([]);
