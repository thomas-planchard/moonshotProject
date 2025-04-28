import React from 'react';
import { useApi } from '../hooks/useApi';
import StatCard from '../components/dashboard/StatCard';
import CarbonEmissionChart from '../components/dashboard/CarbonEmissionChart';
import CarbonDistributionChart from '../components/dashboard/CarbonDistributionChart';
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
  const [trips, setTrips] = React.useState<Trip[]>([]);
  
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getTrips();
      setTrips(data);
    };
    
    fetchData();
  }, [getTrips]);
  
  // Calculate total carbon footprint from all trips
  const totalCarbonFootprint = trips.reduce(
    (total, trip) => total + trip.totalCarbonFootprint, 
    0
  );
  
  // Get distribution data by type
  const getDistributionData = (): ChartData[] => {
    const typeMap: Record<string, number> = { fuel: 0, plane: 0, train: 0 };
    
    // Sum up carbon footprint by type
    trips.forEach(trip => {
      trip.invoices.forEach(invoice => {
        if (isFuelInvoice(invoice)) {
          // For fuel invoices, co2 is a single number
          typeMap.fuel += invoice.co2;
        } else if (isTravelInvoice(invoice)) {
          // For travel invoices (plane/train), sum the co2 array
          if (Array.isArray(invoice.co2)) {
            typeMap[invoice.type] += invoice.co2.reduce((sum, val) => sum + (val || 0), 0);
          }
        }
      });
    });
    
    // Format data for the chart
    return [
      { name: 'Fuel', value: typeMap.fuel, fill: '#F59E0B' },
      { name: 'Plane', value: typeMap.plane, fill: '#4A6FA5' },
      { name: 'Train', value: typeMap.train, fill: '#2D6A4F' },
    ];
  };
  
  // Get monthly data for the bar chart
  const getMonthlyData = () => {
    // Create a map to store emissions by month
    const monthlyData: Record<string, { fuel: number; plane: number; train: number }> = {};
    
    // Define all months to ensure we have entries even for months with no data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(month => {
      monthlyData[month] = { fuel: 0, plane: 0, train: 0 };
    });

    // Process all trips and their invoices
    trips.forEach(trip => {
      // Get trip creation month as fallback
      let tripMonth = 'Jan';
      if (trip.createdAt) {
        const tripDate = new Date(trip.createdAt);
        tripMonth = months[tripDate.getMonth()];
      }
      
      trip.invoices.forEach(invoice => {
        // Determine which month to use (could enhance this with actual invoice date if available)
        const month = tripMonth;
        
        // Calculate CO2 based on invoice type
        if (isFuelInvoice(invoice)) {
          monthlyData[month].fuel += invoice.co2;
        } else if (isTravelInvoice(invoice)) {
          if (Array.isArray(invoice.co2)) {
            const totalCo2 = invoice.co2.reduce((sum, val) => sum + (val || 0), 0);
            if (invoice.type === 'plane') {
              monthlyData[month].plane += totalCo2;
            } else if (invoice.type === 'train') {
              monthlyData[month].train += totalCo2;
            }
          }
        }
      });
    });

    // Convert the map to an array sorted by month
    return months.map(month => ({
      name: month,
      ...monthlyData[month]
    }));
  };
  
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
          title="Total Carbon Footprint"
          value={`${totalCarbonFootprint.toLocaleString()} kg CO₂`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
          description="Overall emissions across all trips"
        />
        
        <StatCard
          title="Average per Trip"
          value={`${trips.length > 0 
            ? Math.round(totalCarbonFootprint / trips.length).toLocaleString() 
            : 0} kg CO₂`}
          icon={<Briefcase className="h-6 w-6" />}
          description="Average emissions per business trip"
        />
        
        <StatCard
          title="Total Trips"
          value={trips.length.toString()}
          icon={<Calendar className="h-6 w-6" />}
          description="Number of business trips recorded"
        />
        
        <StatCard
          title="Highest Impact Source"
          value="Air Travel"
          icon={<AlertTriangle className="h-6 w-6" />}
          description="Most significant contributor to emissions"
        />
      </div>

      <div className="mb-8">
        <QuickAnalysis />
      </div>
      
      <div className="bg-white rounded-lg shadow-card p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Carbon Emissions</h2>
        <CarbonEmissionChart data={getMonthlyData()} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Emission Distribution by Type</h2>
          <CarbonDistributionChart data={getDistributionData()} />
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Trips</h2>
          
          {trips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No trips found. Create a trip to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.slice(0, 5).map(trip => (
                <div key={trip.id} className="p-4 border border-gray-100 rounded-md hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900">{trip.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm">{trip.invoices.length} invoices</span>
                    <span className="text-sm font-medium text-gray-900">
                      {trip.totalCarbonFootprint.toLocaleString()} kg CO₂
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;