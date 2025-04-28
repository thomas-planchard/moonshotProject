import { useState, useCallback } from 'react';
import { Trip, InvoiceType, InvoiceFuel, InvoiceTravel } from '../types';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import axios from 'axios';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getTrips = useCallback(async (): Promise<Trip[]> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) return [];
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return [];

      const userData = userSnap.data();
      const businessTrips = userData.businessTrips || { trips: [] };

      const trips: Trip[] = (businessTrips.trips || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        startDate: t.startDate,
        endDate: t.endDate,
        totalCarbonFootprint: t.carbonFootprint || 0,
        invoices: Array.isArray(t.invoices?.invoices)
          ? t.invoices.invoices.map((inv: any) => {
              if (inv.type === 'fuel') {
                return {
                  id: inv.id || "",
                  type: inv.type,
                  fileName: inv.fileName || "",
                  co2: inv.co2 || 0,
                  volume: inv.volume || 0,
                  typeOfFuel: inv.typeOfFuel || "",
                } as InvoiceFuel;
              }
              return {
                id: inv.id || "",
                tripId: t.id,
                type: inv.type,
                fileName: inv.fileName || "",
                date: inv.date,
                amount: inv.amount || 0,
                carbonFootprint: inv.carbonFootprint || 0,
                name: inv.name || "",
                status: inv.status || "processed",
                description: inv.description || "",
                departure: inv.departure || [],
                arrival: inv.arrival || [],
                transport_type: inv.transport_type || [],
                co2: inv.co2 || []
              } as InvoiceTravel;
            })
          : [],
        createdAt: t.createdAt || "",
      }));

      return trips;
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
      if (!user) return null;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return null;

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
          ? t.invoices.invoices.map((inv: any) => {
              if (inv.type === 'fuel') {
                return {
                  id: inv.id || "",
                  type: inv.type,
                  fileName: inv.fileName || "",
                  co2: inv.co2 || 0,
                  volume: inv.volume || 0,
                  typeOfFuel: inv.typeOfFuel || "",
                } as InvoiceFuel;
              }
              return {
                id: inv.id || "",
                tripId: t.id,
                type: inv.type,
                fileName: inv.fileName || "",
                date: inv.date,
                amount: inv.amount || 0,
                carbonFootprint: inv.carbonFootprint || 0,
                name: inv.name || "",
                status: inv.status || "processed",
                description: inv.description || "",
                departure: inv.departure || [],
                arrival: inv.arrival || [],
                transport_type: inv.transport_type || [],
                co2: inv.co2 || []
              } as InvoiceTravel;
            })
          : [],
        createdAt: t.createdAt || "",
      };

      return trip;
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
      await new Promise(res => setTimeout(res, 1000));
      const now = new Date().toISOString();

      const newTrip: Trip = {
        id: Math.random().toString(36).substring(2, 9),
        name: tripData.name || 'New Trip',
        description: tripData.description || '',
        startDate: tripData.startDate || now.split('T')[0],
        endDate: tripData.endDate || now.split('T')[0],
        totalCarbonFootprint: 0,
        invoices: [],
        createdAt: now
      };

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
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
            }
          ];
          await updateDoc(userRef, { "businessTrips.trips": updatedTrips });
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
  ): Promise<InvoiceType | null> => {
    setLoading(true);
    setError(null);

    try {
      const LLAMA_API_KEY = import.meta.env.VITE_LLAMA_API_KEY;
      const AGENT_ID = type === 'fuel'
        ? import.meta.env.VITE_LLAMA_FUEL_PROJECT_ID
        : import.meta.env.VITE_LLAMA_INVOICES_PROJECT_ID;

      const form = new FormData();
      form.append('upload_file', file, file.name);

      const uploadResp = await axios.post(
        '/llama-api/api/v1/files',
        form,
        { headers: { Authorization: `Bearer ${LLAMA_API_KEY}` } }
      );
      const fileId = uploadResp.data.file_id ?? uploadResp.data.id ?? uploadResp.data.fileId;
      if (!fileId) {
        console.error('No file_id returned:', uploadResp.data);
        throw new Error('Upload succeeded but no file_id was returned');
      }

      const jobResp = await axios.post(
        '/llama-api/api/v1/extraction/jobs',
        { extraction_agent_id: AGENT_ID, file_id: fileId },
        { headers: { Authorization: `Bearer ${LLAMA_API_KEY}` } }
      );
      const jobId = jobResp.data.job_id ?? jobResp.data.id;
      if (!jobId) throw new Error('No job_id returned from extraction');

      let status: string;
      let attempts = 0;
      do {
        await new Promise(r => setTimeout(r, 2000));
        const statusResp = await axios.get(
          `/llama-api/api/v1/extraction/jobs/${jobId}`,
          { headers: { Authorization: `Bearer ${LLAMA_API_KEY}` } }
        );
        status = statusResp.data.status;
        if (status === 'FAILED') throw new Error('Extraction job failed');
        if (++attempts > 30) throw new Error('Extraction job timed out');
      } while (status !== 'SUCCESS');

      const resultResp = await axios.get(
        `/llama-api/api/v1/extraction/jobs/${jobId}/result`,
        { headers: { Authorization: `Bearer ${LLAMA_API_KEY}` } }
      );
      const data = resultResp.data.data || {};

      let newInvoice: InvoiceType;
      let totalCO2: number;

      if (type === 'fuel') {
        const co2Value = data.fuel_co2 || 0;
        totalCO2 = typeof co2Value === 'number' ? co2Value : 0;

        newInvoice = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'fuel',
          fileName: file.name,
          co2: totalCO2,
          volume: data.volume || 0,
          typeOfFuel: data.type_of_fuel || "",
        } as InvoiceFuel;
      } else {
        const departureArray = Array.isArray(data.departure)
          ? data.departure
          : typeof data.departure === 'string'
            ? [data.departure]
            : [];

        const arrivalArray = Array.isArray(data.arrival)
          ? data.arrival
          : typeof data.arrival === 'string'
            ? [data.arrival]
            : [];

        const transportArray = Array.isArray(data.transport_type)
          ? data.transport_type
          : typeof data.transport_type === 'string'
            ? [data.transport_type]
            : [];

        const co2Field = type === 'plane' ? 'flight_co2' : 'train_co2';
        const co2Array = Array.isArray(data[co2Field])
          ? data[co2Field]
          : typeof data[co2Field] === 'number'
            ? [data[co2Field]]
            : [];

        totalCO2 = co2Array.reduce((sum, v) => sum + (v || 0), 0);

        newInvoice = {
          id: Math.random().toString(36).substring(2, 9),
          type,
          fileName: file.name,
          departure: departureArray,
          arrival: arrivalArray,
          transport_type: transportArray,
          co2: co2Array,
        } as InvoiceTravel;
      }

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const trips = (userData.businessTrips?.trips || []);
          const tripIndex = trips.findIndex((t: any) => t.id === tripId);
          if (tripIndex !== -1) {
            const tripInvoices = trips[tripIndex].invoices || { invoices: [] };
            const updatedInvoices = [
              ...tripInvoices.invoices,
              newInvoice
            ];
            trips[tripIndex].invoices = { invoices: updatedInvoices };
            trips[tripIndex].carbonFootprint = (trips[tripIndex].carbonFootprint||0) + totalCO2;
            await updateDoc(userRef, { "businessTrips.trips": trips });
          }
        }
      }

      return newInvoice;
    } catch (err) {
      console.error('Invoice upload error:', err);
      setError('Failed to process invoice: ' + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const analyzeInvoice = useCallback(async (
    type: 'fuel' | 'plane' | 'train'
  ): Promise<{ carbonFootprint: number } | null> => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(res => setTimeout(res, 1000));
      let carbonFootprint = 0;
      switch (type) {
        case 'fuel':  carbonFootprint = Math.floor(Math.random() * 1000) + 500; break;
        case 'plane': carbonFootprint = Math.floor(Math.random() * 3000) + 2000; break;
        case 'train': carbonFootprint = Math.floor(Math.random() * 600) + 200;   break;
      }
      return { carbonFootprint };
    } catch {
      setError('Failed to analyze invoice');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInvoice = useCallback(
    async (tripId: string, invoiceId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        if (!user) throw new Error("Not authenticated");
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) throw new Error("User not found");
        const userData = userSnap.data();
        const trips = userData.businessTrips?.trips || [];
        let ti = trips.findIndex((t: any) => t.id === tripId);
        if (ti === -1) {
          ti = trips.findIndex((t: any) =>
            Array.isArray(t.invoices?.invoices) &&
            t.invoices.invoices.some((inv: any) => inv.id === invoiceId)
          );
        }
        if (ti === -1) {
          throw new Error(`Trip not found for tripId=${tripId} or invoiceId=${invoiceId}`);
        }
        console.log("Deleting invoice", invoiceId, "from trip", trips[ti].id);
        const invList = trips[ti].invoices?.invoices || [];
        const updatedInvs = invList.filter((inv: any) => inv.id !== invoiceId);
        
        // Correctly calculate the new total carbon footprint
        const newTotalCF = updatedInvs.reduce((sum: number, inv: any) => {
          let invoiceCO2 = 0;
          
          // Check invoice type and extract CO2 value accordingly
          if (inv.type === 'fuel') {
            // For fuel invoices, CO2 is a single number
            invoiceCO2 = inv.co2 || 0;
          } else if (inv.type === 'plane' || inv.type === 'train') {
            // For travel invoices, CO2 is an array we need to sum
            if (Array.isArray(inv.co2)) {
              invoiceCO2 = inv.co2.reduce((co2Sum: number, val: number) => co2Sum + (val || 0), 0);
            }
          }
          
          return sum + invoiceCO2;
        }, 0);
        
        trips[ti].invoices = { invoices: updatedInvs };
        trips[ti].carbonFootprint = newTotalCF;
        await updateDoc(userRef, { "businessTrips.trips": trips });
        return true;
      } catch (err) {
        console.error("Delete invoice error:", err);
        setError(err instanceof Error ? err.message : String(err));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const deleteTrip = useCallback(
    async (tripId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        if (!user) throw new Error("Not authenticated");
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) throw new Error("User not found");
        
        const userData = userSnap.data();
        const trips = userData.businessTrips?.trips || [];
        const updatedTrips = trips.filter((trip: any) => trip.id !== tripId);
        
        await updateDoc(userRef, { "businessTrips.trips": updatedTrips });
        return true;
      } catch (err) {
        console.error("Delete trip error:", err);
        setError(err instanceof Error ? err.message : String(err));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return {
    loading,
    error,
    getTrips,
    getTrip,
    createTrip,
    uploadInvoice,
    analyzeInvoice,
    deleteInvoice,
    deleteTrip,
  };
}