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

      // Get shared trips if available
      const sharedTripsData = userData.sharedTrips || [];
      const sharedTripIds = sharedTripsData.map((st: any) => st.id);
      
      // Find all users who have shared trips with current user
      const sharedTrips: Trip[] = [];
      if (sharedTripIds.length > 0) {
        for (const sharedInfo of sharedTripsData) {
          if (!sharedInfo.ownerId) continue;
          
          const ownerRef = doc(db, "users", sharedInfo.ownerId);
          const ownerSnap = await getDoc(ownerRef);
          if (!ownerSnap.exists()) continue;
          
          const ownerData = ownerSnap.data();
          const ownerTrips = ownerData.businessTrips?.trips || [];
          const sharedTrip = ownerTrips.find((t: any) => t.id === sharedInfo.id);
          
          if (sharedTrip) {
            sharedTrips.push(mapTripData(sharedTrip));
          }
        }
      }

      const myTrips: Trip[] = (businessTrips.trips || []).map(mapTripData);
      return [...myTrips, ...sharedTrips];

    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to fetch trips');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Helper function to map trip data to Trip type
  const mapTripData = (t: any): Trip => ({
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
              uploadedBy: inv.uploadedBy || {
                id: t.ownerId || 'unknown',
                name: 'Unknown User'
              }
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
            co2: inv.co2 || [],
            uploadedBy: inv.uploadedBy || {
              id: t.ownerId || 'unknown',
              name: 'Unknown User'
            }
          } as InvoiceTravel;
        })
      : [],
    createdAt: t.createdAt || "",
    ownerId: t.ownerId || "",
    contributors: t.contributors || []
  });

  const getTrip = useCallback(async (id: string): Promise<Trip | null> => {
    setLoading(true);
    setError(null);

    try {
      // Explicit check for authentication - redirect if not logged in
      if (!user) {
        console.warn("User not authenticated, cannot fetch trip");
        window.location.href = '/auth'; // Force navigation to auth page
        return null;
      }
      
      // First check in user's own trips
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return null;

      const userData = userSnap.data();
      const businessTrips = userData.businessTrips || { trips: [] };
      let t = (businessTrips.trips || []).find((trip: any) => trip.id === id);
      
      // If not found in own trips, check shared trips
      if (!t) {
        const sharedTripsData = userData.sharedTrips || [];
        const sharedInfo = sharedTripsData.find((st: any) => st.id === id);
        
        if (sharedInfo && sharedInfo.ownerId) {
          const ownerRef = doc(db, "users", sharedInfo.ownerId);
          const ownerSnap = await getDoc(ownerRef);
          
          if (ownerSnap.exists()) {
            const ownerData = ownerSnap.data();
            const ownerTrips = ownerData.businessTrips?.trips || [];
            t = ownerTrips.find((trip: any) => trip.id === id);
          }
        }
      }
      
      if (!t) return null;

      return mapTripData(t);
      
    } catch (err) {
      console.error('Error fetching trip details:', err);
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
        createdAt: now,
        ownerId: user?.uid || '',
        contributors: tripData.contributors || []
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
              ownerId: user.uid,
              contributors: tripData.contributors || []
            }
          ];
          await updateDoc(userRef, { "businessTrips.trips": updatedTrips });
          
          // Add trip reference to each contributor's account
          if (Array.isArray(tripData.contributors) && tripData.contributors.length > 0) {
            for (const contributor of tripData.contributors) {
              const contribRef = doc(db, "users", contributor.id);
              const contribSnap = await getDoc(contribRef);
              
              if (contribSnap.exists()) {
                const contribData = contribSnap.data();
                const contribTrips = contribData.sharedTrips || [];
                
                // Add reference to the trip
                await updateDoc(contribRef, { 
                  sharedTrips: [...contribTrips, {
                    id: newTrip.id,
                    ownerId: user.uid,
                    ownerName: userData.name || "Unknown",
                    name: newTrip.name,
                    dateShared: now
                  }] 
                });
              }
            }
          }
        }
      }

      return newTrip;
    } catch (err) {
      console.error('Failed to create trip:', err);
      setError('Failed to create trip');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // New function to analyze an invoice file without saving it to the database
  const analyzeInvoiceFile = useCallback(async (
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

      let userName = user?.displayName || '';
      if (!userName && user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().name) {
          userName = userDoc.data().name;
        }
      }

      const uploaderInfo = {
        id: user?.uid || 'unknown',
        name: userName || 'Unknown User'
      };

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
          uploadedBy: uploaderInfo
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

        let co2Array: number[] = [];
        const detectedTypes = transportArray.map((t: any) => (t || '').toLowerCase());
        
        for (let i = 0; i < Math.max(1, detectedTypes.length); i++) {
          const transportType = detectedTypes[i] || type.toLowerCase();
          
          let co2Value = 0;
          if (transportType.includes('train')) {
            if (Array.isArray(data.train_co2) && data.train_co2[i] !== undefined) {
              co2Value = data.train_co2[i];
            } else if (typeof data.train_co2 === 'number') {
              co2Value = data.train_co2;
            }
          } else {
            if (Array.isArray(data.flight_co2) && data.flight_co2[i] !== undefined) {
              co2Value = data.flight_co2[i];
            } else if (typeof data.flight_co2 === 'number') {
              co2Value = data.flight_co2;
            }
          }
          
          co2Array.push(co2Value);
        }
        
        if (co2Array.length === 0) {
          co2Array.push(0);
        }

        totalCO2 = co2Array.reduce((sum, v) => sum + v, 0);

        // Only include distance if it is defined and is an array
        const invoiceBase = {
          id: Math.random().toString(36).substring(2, 9),
          type,
          fileName: file.name,
          departure: departureArray,
          arrival: arrivalArray,
          transport_type: transportArray,
          co2: co2Array,
          uploadedBy: uploaderInfo
        };
        if (Array.isArray(data.distance)) {
          (invoiceBase as any).distance = data.distance;
        }
        newInvoice = invoiceBase as InvoiceTravel;
      }

      return newInvoice;
    } catch (err) {
      console.error('Invoice analysis error:', err);
      setError('Failed to analyze invoice: ' + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Modify the existing uploadInvoice function to accept a pre-analyzed invoice
  const saveInvoiceToDatabase = useCallback(async (
    tripId: string,
    invoice: InvoiceType
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error("Not authenticated");
      
      const totalCO2 = invoice.type === 'fuel' 
        ? (invoice as InvoiceFuel).co2 
        : Array.isArray((invoice as InvoiceTravel).co2) 
          ? (invoice as InvoiceTravel).co2.reduce((sum, val) => sum + (val || 0), 0) 
          : 0;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const myTrips = userData.businessTrips?.trips || [];
        const myTripIndex = myTrips.findIndex((t: any) => t.id === tripId);
        
        if (myTripIndex !== -1) {
          const tripInvoices = myTrips[myTripIndex].invoices || { invoices: [] };
          const updatedInvoices = [...tripInvoices.invoices, invoice];
          myTrips[myTripIndex].invoices = { invoices: updatedInvoices };
          myTrips[myTripIndex].carbonFootprint = (myTrips[myTripIndex].carbonFootprint||0) + totalCO2;
          
          if (invoice.type !== 'fuel') {
            const transportTypes = myTrips[myTripIndex].transportTypes || {};
            const travelInvoice = invoice as InvoiceTravel;
            travelInvoice.transport_type.forEach((t: string | null | undefined) => {
              const transportType = t?.toLowerCase() || invoice.type.toLowerCase();
              transportTypes[transportType] = (transportTypes[transportType] || 0) + 1;
            });
            myTrips[myTripIndex].transportTypes = transportTypes;
          }
          
          await updateDoc(userRef, { "businessTrips.trips": myTrips });
          return true;
        } else {
          const sharedTripsData = userData.sharedTrips || [];
          const sharedTripInfo = sharedTripsData.find((st: any) => st.id === tripId);
          
          if (sharedTripInfo && sharedTripInfo.ownerId) {
            const ownerRef = doc(db, "users", sharedTripInfo.ownerId);
            const ownerSnap = await getDoc(ownerRef);
            
            if (ownerSnap.exists()) {
              const ownerData = ownerSnap.data();
              const ownerTrips = ownerData.businessTrips?.trips || [];
              const ownerTripIndex = ownerTrips.findIndex((t: any) => t.id === tripId);
              
              if (ownerTripIndex !== -1) {
                const tripInvoices = ownerTrips[ownerTripIndex].invoices || { invoices: [] };
                const updatedInvoices = [...tripInvoices.invoices, invoice];
                ownerTrips[ownerTripIndex].invoices = { invoices: updatedInvoices };
                ownerTrips[ownerTripIndex].carbonFootprint = (ownerTrips[ownerTripIndex].carbonFootprint||0) + totalCO2;
                
                if (invoice.type !== 'fuel') {
                  const transportTypes = ownerTrips[ownerTripIndex].transportTypes || {};
                  const travelInvoice = invoice as InvoiceTravel;
                  travelInvoice.transport_type.forEach((t: string | null | undefined) => {
                    const transportType = t?.toLowerCase() || invoice.type.toLowerCase();
                    transportTypes[transportType] = (transportTypes[transportType] || 0) + 1;
                  });
                  ownerTrips[ownerTripIndex].transportTypes = transportTypes;
                }
                
                await updateDoc(ownerRef, { "businessTrips.trips": ownerTrips });
                return true;
              }
            }
          }
        }
      }
      
      throw new Error('Trip not found');
    } catch (err) {
      console.error('Invoice save error:', err);
      setError('Failed to save invoice: ' + (err instanceof Error ? err.message : String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Keep the old uploadInvoice function for backwards compatibility
  const uploadInvoice = useCallback(async (
    tripId: string,
    file: File,
    type: 'fuel' | 'plane' | 'train'
  ): Promise<InvoiceType | null> => {
    try {
      const invoice = await analyzeInvoiceFile(file, type);
      if (!invoice) return null;
      
      const success = await saveInvoiceToDatabase(tripId, invoice);
      if (!success) return null;
      
      return invoice;
    } catch (err) {
      console.error('Invoice upload error:', err);
      setError('Failed to process invoice: ' + (err instanceof Error ? err.message : String(err)));
      return null;
    }
  }, [analyzeInvoiceFile, saveInvoiceToDatabase]);

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
        
        const newTotalCF = updatedInvs.reduce((sum: number, inv: any) => {
          let invoiceCO2 = 0;
          
          if (inv.type === 'fuel') {
            invoiceCO2 = inv.co2 || 0;
          } else if (inv.type === 'plane' || inv.type === 'train') {
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
    analyzeInvoiceFile,
    saveInvoiceToDatabase,
    analyzeInvoice,
    deleteInvoice,
    deleteTrip,
  };
}