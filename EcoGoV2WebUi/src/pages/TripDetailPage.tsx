import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import InvoiceDropZone from '../components/invoices/InvoiceDropZone';
import InvoiceTable from '../components/invoices/InvoiceTable';
import CarbonDistributionChart from '../components/dashboard/CarbonDistributionChart';
import { ChevronLeft, Clock, Calendar, ArrowDownCircle, Briefcase, TrendingUp, Pencil, Users, X, Search, Plus, UserPlus } from 'lucide-react';
import { Trip, ChartData, InvoiceType, InvoiceFuel, InvoiceTravel, Contributor } from '../types';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

// Helper function to check if invoice is a fuel invoice
const isFuelInvoice = (invoice: InvoiceType): invoice is InvoiceFuel => {
  return invoice.type === 'fuel';
};

// Helper function to check if invoice is a travel invoice
const isTravelInvoice = (invoice: InvoiceType): invoice is InvoiceTravel => {
  return invoice.type === 'plane' || invoice.type === 'train';
};

const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTrip, loading, error } = useApi();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Editing state
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    contributors: [] as Contributor[]
  });
  const [saving, setSaving] = useState(false);

  // Contributor search state
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      if (id === 'new') {
        navigate('/trips/new');
        return;
      }
      
      if (!id) return;
      
      const tripData = await getTrip(id);
      setTrip(tripData);
    };
    
    fetchTrip();
  }, [id, getTrip, navigate, refreshTrigger]);

  useEffect(() => {
    if (trip) {
      setEditFields({
        name: trip.name,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        contributors: trip.contributors || []
      });
    }
  }, [trip]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate trip duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays + 1; // Include the start day
  };

  // Prepare data for carbon distribution chart
  const getChartData = (): ChartData[] => {
    if (!trip) return [];
    
    // Initialize counters for each type and subtype
    const emissions = {
      fuel: {
        total: 0,
        types: {} as Record<string, number>
      },
      plane: {
        total: 0
      },
      train: {
        total: 0
      }
    };
    
    // Sum up carbon footprint by type
    trip.invoices.forEach(invoice => {
      if (isFuelInvoice(invoice)) {
        // Handle fuel invoices
        const co2Value = invoice.co2;
        emissions.fuel.total += co2Value;
        
        // Track emissions by fuel type for more detailed breakdown
        const fuelType = invoice.typeOfFuel || 'Unknown';
        if (!emissions.fuel.types[fuelType]) {
          emissions.fuel.types[fuelType] = 0;
        }
        emissions.fuel.types[fuelType] += co2Value;
      }
      else if (isTravelInvoice(invoice)) {
        // Handle travel invoices
        // Use transport_type to determine which category to add to
        const totalCo2 = Array.isArray(invoice.co2) 
          ? invoice.co2.reduce((sum, val) => sum + (val || 0), 0)
          : 0;
          
        // Check each item in the transport_type array when available
        if (Array.isArray(invoice.transport_type) && invoice.transport_type.length > 0) {
          for (const transportType of invoice.transport_type) {
            const type = (transportType || '').toLowerCase();
            if (type.includes('train') || type === 'train') {
              emissions.train.total += totalCo2 / invoice.transport_type.length; // Split CO2 by transport types
            } else {
              // Default to plane for any other type
              emissions.plane.total += totalCo2 / invoice.transport_type.length;
            }
          }
        } else {
          // Fall back to the invoice type if transport_type is not available
          if (invoice.type === 'plane') {
            emissions.plane.total += totalCo2;
          } else if (invoice.type === 'train') {
            emissions.train.total += totalCo2;
          }
        }
      }
    });
    
    // Format data for the chart - main categories
    const chartData: ChartData[] = [];
    
    if (emissions.fuel.total > 0) {
      chartData.push({ 
        name: 'Fuel', 
        value: emissions.fuel.total, 
        fill: '#F59E0B' // Amber color for fuel
      });
    }
    
    if (emissions.plane.total > 0) {
      chartData.push({ 
        name: 'Plane', 
        value: emissions.plane.total, 
        fill: '#4A6FA5' // Blue color for plane
      });
    }
    
    if (emissions.train.total > 0) {
      chartData.push({ 
        name: 'Train', 
        value: emissions.train.total, 
        fill: '#2D6A4F' // Green color for train
      });
    }
    
    return chartData;
  };

  // Get detailed breakdown of fuel types for additional analysis
  const getFuelTypeBreakdown = (): ChartData[] => {
    if (!trip) return [];
    
    const fuelTypeMap: Record<string, number> = {};
    
    trip.invoices.forEach(invoice => {
      if (isFuelInvoice(invoice)) {
        const fuelType = invoice.typeOfFuel || 'Unknown';
        if (!fuelTypeMap[fuelType]) {
          fuelTypeMap[fuelType] = 0;
        }
        fuelTypeMap[fuelType] += invoice.co2;
      }
    });
    
    // Convert to chart data format
    return Object.entries(fuelTypeMap).map(([fuelType, value], index) => {
      // Create different shades of amber for different fuel types
      const hue = 35; // Amber base hue
      const lightness = 45 + (index * 5) % 25; // Vary lightness
      
      return {
        name: fuelType,
        value,
        fill: `hsl(${hue}, 90%, ${lightness}%)`
      };
    });
  };

  // Save edited trip info to Firestore
  const handleSaveEdit = async () => {
    if (!user || !trip) return;
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const businessTrips = userData.businessTrips || { trips: [] };
        const trips = businessTrips.trips || [];
        const idx = trips.findIndex((t: any) => t.id === trip.id);
        if (idx !== -1) {
          trips[idx] = {
            ...trips[idx],
            name: editFields.name,
            description: editFields.description,
            startDate: editFields.startDate,
            endDate: editFields.endDate,
            contributors: editFields.contributors
          };
          await updateDoc(userRef, { "businessTrips.trips": trips });
          
          // Update contributor references - handle both new and removed contributors
          const oldContributorIds = trip.contributors.map(c => c.id);
          const newContributorIds = editFields.contributors.map(c => c.id);
          
          // Handle added contributors
          const addedContributors = editFields.contributors.filter(
            c => !oldContributorIds.includes(c.id)
          );
          
          for (const contributor of addedContributors) {
            const contribRef = doc(db, "users", contributor.id);
            const contribSnap = await getDoc(contribRef);
            
            if (contribSnap.exists()) {
              const contribData = contribSnap.data();
              const contribTrips = contribData.sharedTrips || [];
              
              // Add reference to the trip
              await updateDoc(contribRef, { 
                sharedTrips: [...contribTrips, {
                  id: trip.id,
                  ownerId: user.uid,
                  ownerName: userData.name || "Unknown",
                  name: editFields.name,
                  dateShared: new Date().toISOString()
                }] 
              });
            }
          }
          
          // Handle removed contributors
          const removedContributorIds = oldContributorIds.filter(
            id => !newContributorIds.includes(id)
          );
          
          for (const contributorId of removedContributorIds) {
            const contribRef = doc(db, "users", contributorId);
            const contribSnap = await getDoc(contribRef);
            
            if (contribSnap.exists()) {
              const contribData = contribSnap.data();
              const contribTrips = contribData.sharedTrips || [];
              
              // Remove reference to this trip
              const updatedSharedTrips = contribTrips.filter(
                (st: any) => st.id !== trip.id
              );
              
              await updateDoc(contribRef, { sharedTrips: updatedSharedTrips });
            }
          }
        }
      }
      setTrip((prev) =>
        prev
          ? {
              ...prev,
              name: editFields.name,
              description: editFields.description,
              startDate: editFields.startDate,
              endDate: editFields.endDate,
              contributors: editFields.contributors
            }
          : prev
      );
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  // Handle searching for users
  const handleSearchUsers = async () => {
    if (!searchEmail.trim() || !searchEmail.includes('@')) {
      setSearchError('Please enter a valid email');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", searchEmail.trim().toLowerCase()));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setSearchError('No user found with that email');
        setSearchResults([]);
      } else {
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Filter out users already selected and current user
        const filteredResults = results.filter(
          u => u.id !== user?.uid && !editFields.contributors.some(c => c.id === u.id)
        );
        setSearchResults(filteredResults);
      }
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchError('Failed to search for users');
    } finally {
      setIsSearching(false);
    }
  };

  // Add contributor to selected list
  const addContributor = (contributor: any) => {
    setEditFields(prev => ({ 
      ...prev, 
      contributors: [
        ...prev.contributors, 
        { 
          id: contributor.id, 
          name: contributor.name, 
          email: contributor.email 
        }
      ]
    }));
    setSearchResults([]);
    setSearchEmail('');
  };

  // Remove contributor from selected list
  const removeContributor = (id: string) => {
    setEditFields(prev => ({ 
      ...prev, 
      contributors: prev.contributors.filter(c => c.id !== id)
    }));
  };

  // Handle successful invoice upload
  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="h-36 bg-gray-200 rounded-lg mb-8"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-error-50 text-error-700 p-4 rounded-md">
          {error || "Trip not found"}
        </div>
        <div className="mt-4">
          <Link 
            to="/trips" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Trips
          </Link>
        </div>
      </div>
    );
  }

  const chartData = getChartData();
  const hasFuelInvoices = trip.invoices.some(invoice => invoice.type === 'fuel');
  const fuelTypeBreakdown = hasFuelInvoices ? getFuelTypeBreakdown() : [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link 
          to="/trips" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Trips
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-card overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
          <div className="w-full">
            {editing ? (
              <>
                <input
                  className="text-2xl font-bold text-gray-900 mb-2 border-b border-primary-300 focus:outline-none focus:border-primary-500"
                  value={editFields.name}
                  onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
                  disabled={saving}
                />
                <textarea
                  className="mt-2 text-gray-600 w-full border rounded p-2 focus:outline-none focus:border-primary-500"
                  value={editFields.description}
                  onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  disabled={saving}
                />
                <div className="flex flex-wrap gap-4 mt-2">
                  <div>
                    <label className="block text-xs text-gray-500">Start Date</label>
                    <input
                      type="date"
                      className="border rounded px-2 py-1"
                      value={editFields.startDate}
                      onChange={e => setEditFields(f => ({ ...f, startDate: e.target.value }))}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">End Date</label>
                    <input
                      type="date"
                      className="border rounded px-2 py-1"
                      value={editFields.endDate}
                      onChange={e => setEditFields(f => ({ ...f, endDate: e.target.value }))}
                      disabled={saving}
                    />
                  </div>
                </div>
                
                {/* Contributors section */}
                <div className="mt-4">
                  <label className="block text-xs text-gray-500 mb-2">Trip Contributors</label>
                  
                  {/* Selected contributors display */}
                  {editFields.contributors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editFields.contributors.map(contributor => (
                        <div 
                          key={contributor.id}
                          className="flex items-center bg-primary-50 text-primary-700 py-1 px-3 rounded-full text-sm"
                        >
                          <span className="mr-1">{contributor.name}</span>
                          <button
                            type="button"
                            onClick={() => removeContributor(contributor.id)}
                            className="text-primary-500 hover:text-primary-700"
                            disabled={saving}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Contributor search */}
                  <div className="mb-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                          placeholder="Search user by email"
                          className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          disabled={saving}
                        />
                        <div className="absolute right-3 top-2.5 text-gray-400">
                          <Search className="h-5 w-5" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSearchUsers}
                        disabled={isSearching || saving}
                        className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 disabled:bg-gray-300"
                      >
                        {isSearching ? "Searching..." : "Search"}
                      </button>
                    </div>
                    {searchError && (
                      <p className="mt-1 text-sm text-error-600">{searchError}</p>
                    )}
                  </div>
                  
                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="border rounded-md divide-y mb-3">
                      {searchResults.map(result => (
                        <div 
                          key={result.id} 
                          className="p-2 flex justify-between items-center hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <div className="bg-secondary-100 text-secondary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                              <Users className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{result.name}</div>
                              <div className="text-sm text-gray-500">{result.email}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addContributor(result)}
                            className="text-primary-600 hover:text-primary-800 flex items-center"
                            disabled={saving}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex gap-2">
                  <button
                    className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
                    onClick={handleSaveEdit}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  {trip.name}
                  <button
                    className="ml-2 p-1 text-gray-400 hover:text-primary-500"
                    onClick={() => setEditing(true)}
                    aria-label="Edit trip"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </h1>
                <p className="mt-2 text-gray-600">{trip.description}</p>
                
                {/* Show contributors in view mode */}
                {trip.contributors && trip.contributors.length > 0 && (
                  <div className="mt-3 flex items-center">
                    <UserPlus className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600 mr-2">
                      Shared with:
                    </span>
                    <div className="flex space-x-1">
                      {trip.contributors.map((contributor, index) => (
                        <span key={contributor.id} className="text-sm text-primary-700 bg-primary-50 px-2 py-1 rounded-full">
                          {contributor.name}
                          {index < trip.contributors.length - 1 ? '' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="p-6 flex items-center">
            <Calendar className="h-6 w-6 text-secondary-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Trip Dates</p>
              <p className="font-medium">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </p>
            </div>
          </div>
          
          <div className="p-6 flex items-center">
            <Clock className="h-6 w-6 text-secondary-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">
                {calculateDuration(trip.startDate, trip.endDate)} days
              </p>
            </div>
          </div>
          
          <div className="p-6 flex items-center">
            <ArrowDownCircle className="h-6 w-6 text-secondary-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Invoices Uploaded</p>
              <p className="font-medium">{trip.invoices.length}</p>
            </div>
          </div>
          
          <div className="p-6 flex items-center">
            <TrendingUp className="h-6 w-6 text-secondary-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Carbon Footprint</p>
              <p className="font-medium">{Math.round(trip.totalCarbonFootprint).toLocaleString()} kg CO₂</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Invoices</h2>
          <InvoiceDropZone tripId={trip.id} onUploadSuccess={handleUploadSuccess} />
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Emission Breakdown</h2>
          
          {chartData.length > 0 ? (
            <>
              <CarbonDistributionChart data={chartData} />
              
              {/* Show detailed fuel breakdown if we have fuel invoices */}
              {hasFuelInvoices && fuelTypeBreakdown.length > 1 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Fuel Type Breakdown</h3>
                  <div className="space-y-2">
                    {fuelTypeBreakdown.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span 
                            className="inline-block w-3 h-3 mr-2 rounded-full"
                            style={{ backgroundColor: item.fill }}
                          ></span>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{Math.round(item.value).toLocaleString()} kg CO₂</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
              <Briefcase className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">
                No emissions data yet.<br />Upload invoices to see your carbon footprint.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Invoices</h2>
        <InvoiceTable invoices={trip.invoices} tripId={trip.id} onInvoiceDeleted={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default TripDetailPage;