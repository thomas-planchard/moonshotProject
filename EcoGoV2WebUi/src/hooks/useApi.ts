import { useState, useCallback } from 'react';
import { Trip, Invoice } from '../types';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getTrips = useCallback(async (): Promise<Trip[]> => {
    setLoading(true);
    setError(null);

    try {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const businessTrips = userData.businessTrips || { trips: [] };
          // Map Firestore trips to Trip[]
          const trips: Trip[] = (businessTrips.trips || []).map((t: any) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            startDate: t.startDate,
            endDate: t.endDate,
            totalCarbonFootprint: t.carbonFootprint || 0,
            invoices: Array.isArray(t.invoices?.invoices)
              ? t.invoices.invoices.map((inv: any) => ({
                  id: inv.id || "",
                  tripId: t.id,
                  type: inv.type,
                  date: inv.date,
                  amount: inv.amount || 0,
                  carbonFootprint: inv.carbonFootprint || 0,
                  fileName: inv.fileName || "",
                  status: inv.status || "processed",
                  description: inv.description || "",
                }))
              : [],
            createdAt: t.createdAt || "",
          }));
          return trips;
        }
        return [];
      } else {
        // Not logged in, return empty
        return [];
      }
    } catch (err) {
      setError('Failed to fetch trips');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getTrip = useCallback(async (id: string): Promise<Trip | null> => {
    setLoading(true);
    setError(null);

    try {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const businessTrips = userData.businessTrips || { trips: [] };
          const t = (businessTrips.trips || []).find((trip: any) => trip.id === id);
          if (!t) return null;
          const trip: Trip = {
            id: t.id,
            name: t.name,
            description: t.description,
            startDate: t.startDate,
            endDate: t.endDate,
            totalCarbonFootprint: t.carbonFootprint || 0,
            invoices: Array.isArray(t.invoices?.invoices)
              ? t.invoices.invoices.map((inv: any) => ({
                  id: inv.id || "",
                  tripId: t.id,
                  type: inv.type,
                  date: inv.date,
                  amount: inv.amount || 0,
                  carbonFootprint: inv.carbonFootprint || 0,
                  fileName: inv.fileName || "",
                  status: inv.status || "processed",
                  description: inv.description || "",
                }))
              : [],
            createdAt: t.createdAt || "",
          };
          return trip;
        }
        return null;
      } else {
        return null;
      }
    } catch (err) {
      setError('Failed to fetch trip details');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTrip = useCallback(async (tripData: Partial<Trip>): Promise<Trip | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the current date/time for createdAt
      const now = new Date().toISOString();
      const newTrip: Trip = {
        id: Math.random().toString(36).substring(2, 9),
        name: tripData.name || 'New Trip',
        description: tripData.description || '',
        startDate: tripData.startDate || new Date().toISOString().split('T')[0],
        endDate: tripData.endDate || new Date().toISOString().split('T')[0],
        totalCarbonFootprint: 0,
        invoices: [],
        createdAt: now
      };

      // Add trip to Firestore under the current user's businessTrips.trips array
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          // Ensure businessTrips and trips array exist
          const userData = userSnap.data();
          const businessTrips = userData.businessTrips || { totalCarbon: 0, trips: [] };
          const updatedTrips = [
            ...(businessTrips.trips || []),
            {
              id: newTrip.id,
              name: newTrip.name,
              description: newTrip.description,
              startDate: newTrip.startDate,
              endDate: newTrip.endDate,
              createdAt: now,
              carbonFootprint: 0,
              invoices: [],
            }
          ];
          await updateDoc(userRef, {
            "businessTrips.trips": updatedTrips
          });
        }
      }
      
      return newTrip;
    } catch (err) {
      setError('Failed to create trip');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

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