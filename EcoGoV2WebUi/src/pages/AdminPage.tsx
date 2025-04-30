import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Department, Trip, InvoiceType, InvoiceFuel, InvoiceTravel } from '../types';
import StatCard from '../components/dashboard/StatCard';
import CarbonDistributionChart from '../components/dashboard/CarbonDistributionChart';
import CarbonEmissionChart from '../components/dashboard/CarbonEmissionChart';
import { Users, ArrowLeft, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

// Helper functions to check invoice types
const isFuelInvoice = (invoice: InvoiceType): invoice is InvoiceFuel => {
  return invoice.type === 'fuel';
};

const isTravelInvoice = (invoice: InvoiceType): invoice is InvoiceTravel => {
  return invoice.type === 'plane' || invoice.type === 'train';
};

interface MonthlyData {
  [month: string]: { fuel: number; plane: number; train: number };
}

interface UserCarbonData {
  totalCarbon: number;
  fuelCarbon: number;
  planeCarbon: number;
  trainCarbon: number;
}

// Helper function to map trip data from Firestore to our Trip type
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

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isManager, userDepartment } = useAuth();
  const [loading, setLoading] = useState(true);
  const [departmentUsers, setDepartmentUsers] = useState<UserProfile[]>([]);
  const [userCarbonData, setUserCarbonData] = useState<Record<string, UserCarbonData>>({});
  const [totalDepartmentCarbon, setTotalDepartmentCarbon] = useState(0);
  const [avgDepartmentCarbon, setAvgDepartmentCarbon] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({ fuel: 0, plane: 0, train: 0 });
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showTopEmitters, setShowTopEmitters] = useState(true);
  const [monthlyEmissions, setMonthlyEmissions] = useState<MonthlyData>({});
  const [topEmittersByCategory, setTopEmittersByCategory] = useState<Record<string, string>>({});

  // Check if the user is a manager
  useEffect(() => {
    if (!isManager()) {
      navigate('/');
    }
  }, [isManager, navigate]);

  // Fetch departmental data
  useEffect(() => {
    if (!userDepartment) return;
    
    const fetchDepartmentData = async () => {
      try {
        setLoading(true);
        
        // Fetch all users in the department
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('department', '==', userDepartment));
        const querySnapshot = await getDocs(q);
        
        const users: UserProfile[] = [];
        const userIds: string[] = [];
        
        // Process each user in the department
        for (const docSnapshot of querySnapshot.docs) {
          const userData = docSnapshot.data();
          const userId = docSnapshot.id;
          userIds.push(userId);
          
          const user: UserProfile = {
            id: userId,
            name: userData.name || 'Unknown',
            email: userData.email || '',
            jobPosition: userData.jobPosition || '',
            department: userData.department as Department,
            role: userData.role || 'employee',
            totalCarbon: 0 // We'll calculate this from invoices
          };
          
          users.push(user);
        }
        
        // Initialize data structures
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData: MonthlyData = {};
        months.forEach(month => {
          monthlyData[month] = { fuel: 0, plane: 0, train: 0 };
        });
        
        const userCarbon: Record<string, UserCarbonData> = {};
        userIds.forEach(id => {
          userCarbon[id] = { 
            totalCarbon: 0, 
            fuelCarbon: 0, 
            planeCarbon: 0, 
            trainCarbon: 0 
          };
        });
        
        const totals = { fuel: 0, plane: 0, train: 0 };
        let departmentTotal = 0;
        
        const categoryHighest: Record<string, { userId: string, value: number }> = {
          fuel: { userId: '', value: 0 },
          plane: { userId: '', value: 0 },
          train: { userId: '', value: 0 },
        };
        
        // Fetch trips for all users in the department
        const allTrips: Trip[] = [];
        
        // For each user in the department, fetch their trips
        for (const userId of userIds) {
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const businessTrips = userData.businessTrips || { trips: [] };
            const userTrips = (businessTrips.trips || []).map(mapTripData);
            
            // Add all trips to our collection
            allTrips.push(...userTrips);
            
            // Also get shared trips for this user
            const sharedTripsData = userData.sharedTrips || [];
            
            for (const sharedInfo of sharedTripsData) {
              if (!sharedInfo.ownerId) continue;
              
              const ownerRef = doc(db, "users", sharedInfo.ownerId);
              const ownerSnap = await getDoc(ownerRef);
              if (!ownerSnap.exists()) continue;
              
              const ownerData = ownerSnap.data();
              const ownerTrips = ownerData.businessTrips?.trips || [];
              const sharedTrip = ownerTrips.find((t: any) => t.id === sharedInfo.id);
              
              if (sharedTrip) {
                allTrips.push(mapTripData(sharedTrip));
              }
            }
          }
        }
        
        // Process all trips to calculate emissions - we now have trips from ALL department users
        allTrips.forEach(trip => {
          const tripDate = new Date(trip.createdAt || new Date());
          const month = months[tripDate.getMonth()];
          
          // Process invoices in this trip
          trip.invoices.forEach(invoice => {
            // Check if invoice was uploaded by a department user
            const uploaderId = invoice.uploadedBy?.id;
            if (!uploaderId || !userIds.includes(uploaderId)) return;
            
            // Process based on invoice type
            if (isFuelInvoice(invoice)) {
              const co2Value = invoice.co2;
              
              // Update monthly data
              monthlyData[month].fuel += co2Value;
              
              // Update category totals
              totals.fuel += co2Value;
              departmentTotal += co2Value;
              
              // Update user carbon data
              userCarbon[uploaderId].totalCarbon += co2Value;
              userCarbon[uploaderId].fuelCarbon += co2Value;
              
              // Check if this is the new top emitter for fuel
              if (co2Value > categoryHighest.fuel.value) {
                categoryHighest.fuel = { userId: uploaderId, value: co2Value };
              }
            } 
            else if (isTravelInvoice(invoice) && Array.isArray(invoice.co2)) {
              // For travel invoices, check each segment's transport type
              if (Array.isArray(invoice.transport_type) && invoice.transport_type.length > 0) {
                // Process each segment separately
                invoice.transport_type.forEach((transportType, index) => {
                  const segmentCO2 = invoice.co2[index] || 0;
                  const type = (transportType || '').toLowerCase();
                  
                  if (type.includes('train') || type === 'train' || type.includes('rail')) {
                    // It's a train
                    monthlyData[month].train += segmentCO2;
                    totals.train += segmentCO2;
                    departmentTotal += segmentCO2;
                    userCarbon[uploaderId].totalCarbon += segmentCO2;
                    userCarbon[uploaderId].trainCarbon += segmentCO2;
                    
                    // Check for top emitter
                    if (segmentCO2 > categoryHighest.train.value) {
                      categoryHighest.train = { userId: uploaderId, value: segmentCO2 };
                    }
                  } else {
                    // Default to plane for air travel and any other mode
                    monthlyData[month].plane += segmentCO2;
                    totals.plane += segmentCO2;
                    departmentTotal += segmentCO2;
                    userCarbon[uploaderId].totalCarbon += segmentCO2;
                    userCarbon[uploaderId].planeCarbon += segmentCO2;
                    
                    // Check for top emitter
                    if (segmentCO2 > categoryHighest.plane.value) {
                      categoryHighest.plane = { userId: uploaderId, value: segmentCO2 };
                    }
                  }
                });
              } else {
                // Fallback to invoice type if no transport_type details
                const totalCO2 = invoice.co2.reduce((sum, val) => sum + (val || 0), 0);
                departmentTotal += totalCO2;
                userCarbon[uploaderId].totalCarbon += totalCO2;
                
                if (invoice.type === 'plane') {
                  monthlyData[month].plane += totalCO2;
                  totals.plane += totalCO2;
                  userCarbon[uploaderId].planeCarbon += totalCO2;
                  
                  if (totalCO2 > categoryHighest.plane.value) {
                    categoryHighest.plane = { userId: uploaderId, value: totalCO2 };
                  }
                } else if (invoice.type === 'train') {
                  monthlyData[month].train += totalCO2;
                  totals.train += totalCO2;
                  userCarbon[uploaderId].trainCarbon += totalCO2;
                  
                  if (totalCO2 > categoryHighest.train.value) {
                    categoryHighest.train = { userId: uploaderId, value: totalCO2 };
                  }
                }
              }
            }
          });
        });
        
        // Update user totals with calculated values
        const updatedUsers = users.map(user => ({
          ...user,
          totalCarbon: userCarbon[user.id]?.totalCarbon || 0
        }));
        
        // Sort users by carbon footprint (highest first)
        const sortedUsers = updatedUsers.sort((a, b) => b.totalCarbon - a.totalCarbon);
        
        // Map top emitter IDs
        const topEmitters: Record<string, string> = {};
        for (const category in categoryHighest) {
          const emitterId = categoryHighest[category].userId;
          if (emitterId) {
            topEmitters[category] = emitterId;
          }
        }
        
        setDepartmentUsers(sortedUsers);
        setUserCarbonData(userCarbon);
        setTotalDepartmentCarbon(departmentTotal);
        setAvgDepartmentCarbon(users.length > 0 ? departmentTotal / users.length : 0);
        setCategoryTotals(totals);
        setMonthlyEmissions(monthlyData);
        setTopEmittersByCategory(topEmitters);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching department data:', error);
        setLoading(false);
      }
    };
    
    fetchDepartmentData();
  }, [userDepartment]);

  // Generate chart data for department carbon distribution by employee
  const getEmployeeDistributionData = () => {
    // Show top contributors individually, group the rest as "Others"
    // For larger departments, show more in the "Others" category
    const MAX_INDIVIDUAL_SEGMENTS = departmentUsers.length <= 10 ? 5 : 3;
    
    const topUsers = departmentUsers.slice(0, MAX_INDIVIDUAL_SEGMENTS); 
    const otherUsers = departmentUsers.slice(MAX_INDIVIDUAL_SEGMENTS);
    const otherTotal = otherUsers.reduce((sum, user) => sum + user.totalCarbon, 0);
    
    // Define custom colors for the chart segments
    const EMPLOYEE_COLORS = [
      '#F59E0B', // Amber
      '#3B82F6', // Blue
      '#10B981', // Green
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#EF4444', // Red
      '#14B8A6', // Teal
      '#F97316', // Orange
    ];
    
    const chartData = topUsers.map((user, index) => ({
      name: user.name,
      value: user.totalCarbon,
      fill: EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length],
    }));
    
    // Add "Others" category if there are more employees than we show individually
    if (otherUsers.length > 0) {
      chartData.push({
        name: `Others (${otherUsers.length} employees)`,
        value: otherTotal,
        fill: '#A1A1AA' // Gray color for the "Others" category
      });
    }
    
    return chartData;
  };
  
  // Generate chart data for department carbon distribution by category
  const getCategoryDistributionData = () => {
    const chartData = [
      { name: 'Fuel', value: categoryTotals.fuel, fill: '#F59E0B' },
      { name: 'Plane', value: categoryTotals.plane, fill: '#4A6FA5' },
      { name: 'Train', value: categoryTotals.train, fill: '#2D6A4F' }
    ].filter(item => item.value > 0);
    
    return chartData;
  };

  // Get monthly data for the chart from real trip data
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map(month => ({
      name: month,
      fuel: monthlyEmissions[month]?.fuel || 0,
      plane: monthlyEmissions[month]?.plane || 0,
      train: monthlyEmissions[month]?.train || 0
    }));
  };
  
  // Get user emission data for a specific category
  const getUserCategoryEmission = (userId: string, category: 'fuel' | 'plane' | 'train'): number => {
    if (!userCarbonData[userId]) return 0;
    
    switch(category) {
      case 'fuel': return userCarbonData[userId].fuelCarbon;
      case 'plane': return userCarbonData[userId].planeCarbon;
      case 'train': return userCarbonData[userId].trainCarbon;
      default: return 0;
    }
  };

  // Get user profile by ID
  const getUserById = (userId: string): UserProfile | undefined => {
    return departmentUsers.find(user => user.id === userId);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-2 mb-8">
          <ArrowLeft className="h-6 w-6 cursor-pointer" onClick={() => navigate(-1)} />
          <h1 className="text-2xl font-bold">Department Dashboard</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-80 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-2 mb-8">
        <ArrowLeft className="h-6 w-6 cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="text-2xl font-bold">{userDepartment} Department Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Department Members"
          value={departmentUsers.length.toString()}
          icon={<Users className="h-6 w-6" />}
          description={`Total employees in ${userDepartment}`}
        />
        
        <StatCard
          title="Total Carbon Footprint"
          value={`${totalDepartmentCarbon.toLocaleString()} kg CO₂`}
          icon={<TrendingUp className="h-6 w-6" />}
          description={`Combined emissions from ${userDepartment}`}
        />
        
        <StatCard
          title="Average Per Employee"
          value={`${Math.round(avgDepartmentCarbon).toLocaleString()} kg CO₂`}
          icon={<TrendingUp className="h-6 w-6" />}
          description={`Average emissions per employee`}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Distribution by Employee</h2>
          <div className="text-sm text-gray-500 mb-4">
            Carbon emissions distribution across department employees.
          </div>
          <CarbonDistributionChart data={getEmployeeDistributionData()} />
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Emissions</h2>
          <div className="text-sm text-gray-500 mb-4">
            Department-wide carbon emissions by month from real trip data.
          </div>
          <CarbonEmissionChart data={getMonthlyData()} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Emissions by Category</h2>
          <div className="text-sm text-gray-500 mb-4">
            Distribution of carbon emissions by source type.
          </div>
          <CarbonDistributionChart data={getCategoryDistributionData()} />
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Top Emitters by Category</h2>
          <div className="space-y-4">
            {Object.entries(topEmittersByCategory).map(([category, userId]) => {
              const profile = getUserById(userId);
              if (!profile) return null;
              
              return (
                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        category === 'fuel' ? 'bg-amber-500' :
                        category === 'plane' ? 'bg-blue-700' : 'bg-lime-700'
                      }`}></div>
                      <span className="text-gray-700 capitalize font-medium">{category}</span>
                    </div>
                    <span className="text-sm text-gray-500">Highest Impact</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div>
                      <div className="font-medium">{profile.name}</div>
                      <div className="text-sm text-gray-600">{profile.jobPosition}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {getUserCategoryEmission(userId, category as any).toLocaleString()} kg CO₂
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-card p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Top Emitters</h2>
          <button 
            className="text-primary-600 flex items-center text-sm font-medium"
            onClick={() => setShowTopEmitters(!showTopEmitters)}
          >
            {showTopEmitters ? (
              <>Hide <ChevronUp className="h-4 w-4 ml-1" /></>
            ) : (
              <>Show <ChevronDown className="h-4 w-4 ml-1" /></>
            )}
          </button>
        </div>
        
        {showTopEmitters && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carbon Footprint
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Breakdown
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentUsers.slice(0, 5).map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {employee.jobPosition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                      {employee.totalCarbon.toLocaleString()} kg CO₂
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-1">
                        {getUserCategoryEmission(employee.id, 'fuel') > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Fuel: {getUserCategoryEmission(employee.id, 'fuel').toLocaleString()}
                          </span>
                        )}
                        {getUserCategoryEmission(employee.id, 'plane') > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Air: {getUserCategoryEmission(employee.id, 'plane').toLocaleString()}
                          </span>
                        )}
                        {getUserCategoryEmission(employee.id, 'train') > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-lime-100 text-lime-600">
                            Rail: {getUserCategoryEmission(employee.id, 'train').toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-card p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">All Department Members</h2>
          <button 
            className="text-primary-600 flex items-center text-sm font-medium"
            onClick={() => setShowAllMembers(!showAllMembers)}
          >
            {showAllMembers ? (
              <>Hide <ChevronUp className="h-4 w-4 ml-1" /></>
            ) : (
              <>Show <ChevronDown className="h-4 w-4 ml-1" /></>
            )}
          </button>
        </div>
        
        {showAllMembers && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carbon Footprint
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentUsers.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{employee.name}</div>
                      {employee.role === 'manager' && (
                        <div className="text-xs text-primary-600 font-medium mt-1">Manager</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {employee.jobPosition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                      {employee.totalCarbon.toLocaleString()} kg CO₂
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;