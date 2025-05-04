import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import StatCard from '../components/dashboard/StatCard';
import CarbonEmissionChart from '../components/dashboard/CarbonEmissionChart';
import UserCarbonEntriesList from '../components/dashboard/UserCarbonEntriesList';
import QuickAnalysis from '../components/dashboard/QuickAnalysis';
import { TrendingUp, AlertTriangle, Calendar, Briefcase } from 'lucide-react';
import { ChartData, Trip, InvoiceType, InvoiceFuel, InvoiceTravel } from '../types';

// Helper functions to check invoice types
const isFuelInvoice = (invoice: InvoiceType): invoice is InvoiceFuel => {
  return invoice.type === 'fuel';
};

const isTravelInvoice = (invoice: InvoiceType): invoice is InvoiceTravel => {
  return invoice.type === 'plane' || invoice.type === 'train';
};

const Dashboard: React.FC = () => {
  const { getTrips, loading, error } = useApi();
  const { user } = useAuth();
  const [trips, setTrips] = React.useState<Trip[]>([]);
  const [userTotalCarbon, setUserTotalCarbon] = React.useState<number>(0);
  const [manualEntries, setManualEntries] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getTrips();
      setTrips(data);
    };
    fetchData();
  }, [getTrips]);

  // Fetch user's total carbon footprint from their profile
  React.useEffect(() => {
    const fetchUserCarbon = async () => {
      if (!user?.uid) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserTotalCarbon(userData.totalCarbon || 0);
        }
      } catch (error) {
        console.error("Error fetching user carbon data:", error);
      }
    };
    fetchUserCarbon();
  }, [user]);

  // Also fetch manual carbon entries
  React.useEffect(() => {
    const fetchUserManualEntries = async () => {
      if (!user?.uid) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setManualEntries(userData.carbonEntries || []);
        }
      } catch (error) {
        console.error("Error fetching carbon entries:", error);
      }
    };
    fetchUserManualEntries();
  }, [user]);

  // Filter invoices to only include those uploaded by the current user
  const filterUserInvoices = (invoice: InvoiceType) => {
    return invoice.uploadedBy?.id === user?.uid;
  };

  // Calculate total carbon footprint - include manual entries and own invoices from all trips
  const totalCarbonFootprint = trips.reduce((total, trip) => {
    const userInvoices = trip.invoices.filter(filterUserInvoices);
    return total + userInvoices.reduce((tripTotal, invoice) => {
      if (isFuelInvoice(invoice)) {
        return tripTotal + invoice.co2;
      } else if (isTravelInvoice(invoice) && Array.isArray(invoice.co2)) {
        return tripTotal + invoice.co2.reduce((sum, val) => sum + (val || 0), 0);
      }
      return tripTotal;
    }, 0);
  }, 0);

  // Get distribution data - only include user's own invoices
  const getDistributionData = (): ChartData[] => {
    const typeMap: Record<string, number> = { fuel: 0, plane: 0, train: 0 };

    // Process trip invoices - only include user's own invoices
    trips.forEach(trip => {
      trip.invoices
        .filter(filterUserInvoices)
        .forEach(invoice => {
          if (isFuelInvoice(invoice)) {
            typeMap.fuel += invoice.co2;
          } else if (isTravelInvoice(invoice)) {
            if (Array.isArray(invoice.co2)) {
              if (Array.isArray(invoice.transport_type) && invoice.transport_type.length > 0) {
                invoice.transport_type.forEach((transportType, index) => {
                  const segmentCO2 = invoice.co2[index] || 0;
                  const type = (transportType || '').toLowerCase();
                  if (type.includes('train') || type === 'train' || type.includes('rail')) {
                    typeMap.train += segmentCO2;
                  } else {
                    typeMap.plane += segmentCO2;
                  }
                });
              } else {
                const totalCO2 = invoice.co2.reduce((sum, val) => sum + (val || 0), 0);
                typeMap[invoice.type] += totalCO2;
              }
            }
          }
        });
    });

    // Also process manual entries
    manualEntries.forEach(entry => {
      if (entry.type === 'plane') typeMap.plane += entry.co2;
      else if (entry.type === 'train') typeMap.train += entry.co2;
      else if (entry.type === 'car') typeMap.fuel += entry.co2;
    });

    return [
      { name: 'Fuel', value: typeMap.fuel, fill: '#F59E0B' },
      { name: 'Plane', value: typeMap.plane, fill: '#4A6FA5' },
      { name: 'Train', value: typeMap.train, fill: '#2D6A4F' },
    ];
  };

  // Get monthly data - include manual entries and user's own invoices
  const getMonthlyData = () => {
    const monthlyData: Record<string, { fuel: number; plane: number; train: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize monthly data
    months.forEach(month => {
      monthlyData[month] = { fuel: 0, plane: 0, train: 0 };
    });

    // Process trip invoices - only include user's own invoices
    trips.forEach(trip => {
      let tripMonth = 'Jan';
      if (trip.createdAt) {
        const tripDate = new Date(trip.createdAt);
        tripMonth = months[tripDate.getMonth()];
      }

      trip.invoices
        .filter(filterUserInvoices)
        .forEach(invoice => {
          if (isFuelInvoice(invoice)) {
            monthlyData[tripMonth].fuel += invoice.co2;
          } else if (isTravelInvoice(invoice)) {
            if (Array.isArray(invoice.co2)) {
              if (Array.isArray(invoice.transport_type) && invoice.transport_type.length > 0) {
                invoice.transport_type.forEach((transportType, index) => {
                  const segmentCO2 = invoice.co2[index] || 0;
                  const type = (transportType || '').toLowerCase();
                  if (type.includes('train') || type === 'train' || type.includes('rail')) {
                    monthlyData[tripMonth].train += segmentCO2;
                  } else {
                    monthlyData[tripMonth].plane += segmentCO2;
                  }
                });
              } else {
                const totalCO2 = invoice.co2.reduce((sum, val) => sum + (val || 0), 0);
                if (invoice.type === 'plane') {
                  monthlyData[tripMonth].plane += totalCO2;
                } else if (invoice.type === 'train') {
                  monthlyData[tripMonth].train += totalCO2;
                }
              }
            }
          }
        });
    });

    // Add manual entries by month
    manualEntries.forEach(entry => {
      const entryDate = new Date(entry.date || entry.createdAt);
      const month = months[entryDate.getMonth()] || 'Jan';

      if (entry.type === 'car') {
        monthlyData[month].fuel += entry.co2;
      } else if (entry.type === 'plane') {
        monthlyData[month].plane += entry.co2;
      } else if (entry.type === 'train') {
        monthlyData[month].train += entry.co2;
      }
    });

    return months.map(month => ({
      name: month,
      ...monthlyData[month]
    }));
  };

  // Calculate total number of user's own invoices
  const userInvoiceCount = trips.reduce((total, trip) => {
    return total + trip.invoices.filter(filterUserInvoices).length;
  }, 0);

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col space-y-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
        <div className="bg-gray-200 h-80 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error-50 text-error-700 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 inline-block mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Carbon Footprint Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Your Carbon Footprint"
          value={`${Math.round(userTotalCarbon).toLocaleString()} kg CO₂`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
          description="Total carbon footprint from your profile"
        />
        <StatCard
          title="Trip Emissions"
          value={`${Math.round(totalCarbonFootprint).toLocaleString()} kg CO₂`}
          icon={<Briefcase className="h-6 w-6" />}
          description="Emissions from your uploaded invoices"
        />
        <StatCard
          title="Average per Trip"
          value={`${trips.length > 0 
            ? Math.round(totalCarbonFootprint / trips.length).toLocaleString() 
            : 0} kg CO₂`}
          icon={<Briefcase className="h-6 w-6" />}
          description="Your average emissions per trip"
        />
        <StatCard
          title="Your Invoices"
          value={userInvoiceCount.toString()}
          icon={<Calendar className="h-6 w-6" />}
          description="Number of invoices you've uploaded"
        />
      </div>
      <div className="mb-8">
        <QuickAnalysis />
      </div>
      <div className="bg-white rounded-lg shadow-card p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Monthly Carbon Emissions</h2>
        <div className="text-sm text-gray-500 mb-4">
          This chart shows carbon emissions from invoices you've personally uploaded.
        </div>
        <CarbonEmissionChart 
          data={getMonthlyData()} 
        />
      </div>
      <div className="bg-white rounded-lg shadow-card p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Manual Carbon Entries</h2>
        <div className="text-sm text-gray-500 mb-4">
          Carbon entries you've manually added through the dashboard.
        </div>
        {userTotalCarbon > 0 ? (
          <UserCarbonEntriesList userId={user?.uid} />
        ) : (
          <div className="text-center py-4 text-gray-500">
            No manual entries found. Add some using the form above.
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Trips</h2>
        {trips.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No trips found. Create a trip to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.slice(0, 5).map(trip => {
              const userInvoices = trip.invoices.filter(filterUserInvoices);
              const userCarbonFootprint = userInvoices.reduce((sum, invoice) => {
                if (isFuelInvoice(invoice)) {
                  return sum + invoice.co2;
                } else if (isTravelInvoice(invoice) && Array.isArray(invoice.co2)) {
                  return sum + invoice.co2.reduce((co2Sum, val) => co2Sum + (val || 0), 0);
                }
                return sum;
              }, 0);

              return (
                <div key={trip.id} className="p-4 border border-gray-100 rounded-md hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900">{trip.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm">{userInvoices.length} of your invoices</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(userCarbonFootprint).toLocaleString()} kg CO₂
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;