import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ServiceCard from '../../components/domain/marketplace/ServiceCard';
import { Search } from 'lucide-react';

const ServiceCatalog = () => { 
    const [services, setServices] = useState([]);//state to hold service data
    const [loading, setLoading] = useState(true);//state to manage loading 
    const [searchTerm, setSearchTerm] = useState('');// state to hold search term 

    useEffect(() => {//fetch services from api on component mount
        const fetchServices = async () => {//async function to fetch services 

