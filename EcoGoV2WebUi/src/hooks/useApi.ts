import { useState, useCallback } from 'react';
import { Trip, Invoice } from '../types';

// This is a mock API service - replace with actual API calls
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockTrips: Trip[] = [
    {
      id: '1',
      name: 'Business Trip to New York',
      description: 'Annual conference visit',
      startDate: '2025-05-01',
      endDate: '2025-05-08',
      totalCarbonFootprint: 4582,
      invoices: [
        {
          id: '101',
          tripId: '1',
          type: 'plane',
          date: '2025-04-30',
          amount: 850,
          carbonFootprint: 3200,
          fileName: 'flight-ticket.pdf',
          status: 'processed'
        },
        {
          id: '102',
          tripId: '1',
          type: 'fuel',
          date: '2025-05-02',
          amount: 120,
          carbonFootprint: 880,
          fileName: 'taxi-receipt.pdf',
          status: 'processed'
        },
        {
          id: '103',
          tripId: '1',
          type: 'train',
          date: '2025-05-05',
          amount: 65,
          carbonFootprint: 502,
          fileName: 'train-ticket.pdf',
          status: 'processed'
        }
      ],
      createdAt: '2025-04-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Client Meeting in Paris',
      description: 'New client pitch',
      startDate: '2025-06-10',
      endDate: '2025-06-15',
      totalCarbonFootprint: 3105,
      invoices: [
        {
          id: '201',
          tripId: '2',
          type: 'plane',
          date: '2025-06-09',
          amount: 720,
          carbonFootprint: 2800,
          fileName: 'flight-paris.pdf',
          status: 'processed'
        },
        {
          id: '202',
          tripId: '2',
          type: 'train',
          date: '2025-06-12',
          amount: 35,
          carbonFootprint: 305,
          fileName: 'metro-pass.pdf',
          status: 'processed'
        }
      ],
      createdAt: '2025-05-20T14:15:00Z'
    }
  ];

  const getTrips = useCallback(async (): Promise<Trip[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockTrips;
    } catch (err) {
      setError('Failed to fetch trips');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrip = useCallback(async (id: string): Promise<Trip | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const trip = mockTrips.find(t => t.id === id);
      return trip || null;
    } catch (err) {
      setError('Failed to fetch trip details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTrip = useCallback(async (tripData: Partial<Trip>): Promise<Trip | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a new trip with mock data
      const newTrip: Trip = {
        id: Math.random().toString(36).substring(2, 9),
        name: tripData.name || 'New Trip',
        description: tripData.description || '',
        startDate: tripData.startDate || new Date().toISOString().split('T')[0],
        endDate: tripData.endDate || new Date().toISOString().split('T')[0],
        totalCarbonFootprint: 0,
        invoices: [],
        createdAt: new Date().toISOString()
      };
      
      return newTrip;
    } catch (err) {
      setError('Failed to create trip');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadInvoice = useCallback(async (
    tripId: string, 
    file: File, 
    type: 'fuel' | 'plane' | 'train'
  ): Promise<Invoice | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate carbon footprint based on type (simulated data)
      let carbonFootprint = 0;
      let amount = Math.floor(Math.random() * 500) + 50;
      
      switch (type) {
        case 'fuel':
          carbonFootprint = Math.floor(Math.random() * 1000) + 500;
          break;
        case 'plane':
          carbonFootprint = Math.floor(Math.random() * 3000) + 2000;
          break;
        case 'train':
          carbonFootprint = Math.floor(Math.random() * 600) + 200;
          break;
      }
      
      // Create a new invoice
      const newInvoice: Invoice = {
        id: Math.random().toString(36).substring(2, 9),
        tripId,
        type,
        date: new Date().toISOString().split('T')[0],
        amount,
        carbonFootprint,
        fileName: file.name,
        status: 'processed',
      };
      
      return newInvoice;
    } catch (err) {
      setError('Failed to process invoice');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeInvoice = useCallback(async (
    file: File,
    type: 'fuel' | 'plane' | 'train'
  ): Promise<{ carbonFootprint: number } | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock carbon footprint based on type
      let carbonFootprint = 0;
      
      switch (type) {
        case 'fuel':
          carbonFootprint = Math.floor(Math.random() * 1000) + 500;
          break;
        case 'plane':
          carbonFootprint = Math.floor(Math.random() * 3000) + 2000;
          break;
        case 'train':
          carbonFootprint = Math.floor(Math.random() * 600) + 200;
          break;
      }
      
      return { carbonFootprint };
    } catch (err) {
      setError('Failed to analyze invoice');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getTrips,
    getTrip,
    createTrip,
    uploadInvoice,
    analyzeInvoice,
  };
}