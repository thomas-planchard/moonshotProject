import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plane, Train, Car } from 'lucide-react';

interface UserCarbonEntriesListProps {
  userId?: string;
}

interface CarbonEntry {
  id: string;
  type: 'plane' | 'train' | 'car';
  description: string;
  co2: number;
  distance?: number;
  date: string;
  createdAt: string;
}

const UserCarbonEntriesList: React.FC<UserCarbonEntriesListProps> = ({ userId }) => {
  const [carbonEntries, setCarbonEntries] = useState<CarbonEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserCarbonEntries = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const entries = userData.carbonEntries || [];
          // Sort by date, newest first
          const sortedEntries = entries.sort((a: CarbonEntry, b: CarbonEntry) => 
            new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
          );
          setCarbonEntries(sortedEntries);
        } else {
          setCarbonEntries([]);
        }
      } catch (err) {
        console.error("Error fetching carbon entries:", err);
        setError("Failed to load your carbon entries");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCarbonEntries();
  }, [userId]);
  
  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'plane':
        return <Plane className="h-5 w-5" />;
      case 'train':
        return <Train className="h-5 w-5" />;
      case 'car':
        return <Car className="h-5 w-5" />;
      default:
        return <Plane className="h-5 w-5" />;
    }
  };
  
  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-100 rounded-md"></div>;
  }
  
  if (error) {
    return <div className="text-error-600 p-3">{error}</div>;
  }
  
  if (carbonEntries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No carbon entries found. Add some using the form above.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {carbonEntries.slice(0, 5).map((entry) => (
        <div key={entry.id} className="p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${
                entry.type === 'plane' ? 'bg-blue-100 text-blue-700' :
                entry.type === 'train' ? 'bg-lime-100 text-lime-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {getTransportIcon(entry.type)}
              </div>
              <div>
                <div className="font-medium">{entry.description}</div>
                <div className="text-sm text-gray-600">
                  {new Date(entry.date).toLocaleDateString()}
                  {entry.distance && ` • ${entry.distance} km`}
                </div>
              </div>
            </div>
            <div className="font-medium text-gray-900">
              {Math.round(entry.co2).toLocaleString()} kg CO₂
            </div>
          </div>
        </div>
      ))}
      
      {carbonEntries.length > 5 && (
        <div className="text-center pt-2">
          <span className="text-sm text-gray-500">
            Showing 5 of {carbonEntries.length} entries
          </span>
        </div>
      )}
    </div>
  );
};

export default UserCarbonEntriesList;
