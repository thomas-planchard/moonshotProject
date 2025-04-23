import React from 'react';
import { useApi } from '../hooks/useApi';
import StatCard from '../components/dashboard/StatCard';
import CarbonEmissionChart from '../components/dashboard/CarbonEmissionChart';
import CarbonDistributionChart from '../components/dashboard/CarbonDistributionChart';
import QuickAnalysis from '../components/dashboard/QuickAnalysis';
import { TrendingUp, AlertTriangle, Calendar, Briefcase } from 'lucide-react';
import { ChartData, Trip } from '../types';

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
        typeMap[invoice.type] += invoice.carbonFootprint;
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
    // Generate some sample data (in a real app, this would come from the API)
    return [
      { name: 'Jan', fuel: 1200, plane: 3500, train: 800 },
      { name: 'Feb', fuel: 950, plane: 4200, train: 750 },
      { name: 'Mar', fuel: 1100, plane: 3800, train: 820 },
      { name: 'Apr', fuel: 1300, plane: 3200, train: 780 },
      { name: 'May', fuel: 1400, plane: 3700, train: 810 },
      { name: 'Jun', fuel: 1250, plane: 4500, train: 890 },
    ];
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