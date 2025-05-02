import React, { useState } from 'react';
import { PlusCircle, TrendingUp, Plane, Train, Car, Check, X, AlertCircle, Save, RotateCw } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';

type EntryMode = 'direct' | 'distance';
type TransportType = 'plane' | 'train' | 'car';

interface CarbonEntry {
  id: string;
  type: TransportType;
  description: string;
  co2Value: number;
  distance?: number;
}

// CO2 emission factors (kg CO2 per km)
const EMISSION_FACTORS = {
  plane: 0.13,
  train: 0.035,
  car: 0.17 // average for medium-sized car
};

const QuickAnalysis: React.FC = () => {
  const [entryMode, setEntryMode] = useState<EntryMode>('distance');
  const [entries, setEntries] = useState<CarbonEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [transportType, setTransportType] = useState<TransportType>('plane');
  const [description, setDescription] = useState('');
  const [directCO2, setDirectCO2] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { saveUserCarbonEntry, loading } = useApi();
  
  // Generate a unique ID for new entries
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Calculate CO2 from distance and transport type
  const calculateCO2 = (distanceKm: number, type: TransportType): number => {
    return distanceKm * EMISSION_FACTORS[type];
  };

  // Add a new entry
  const addEntry = () => {
    if (entryMode === 'direct') {
      if (!directCO2 || isNaN(parseFloat(directCO2)) || parseFloat(directCO2) <= 0) {
        setErrorMessage('Please enter a valid CO2 amount');
        return;
      }
      
      const co2Value = parseFloat(directCO2);
      
      setEntries([...entries, {
        id: generateId(),
        type: transportType,
        description: description || `${transportType.charAt(0).toUpperCase() + transportType.slice(1)} journey`,
        co2Value: co2Value,
      }]);
      
    } else {
      if (!distance || isNaN(parseFloat(distance)) || parseFloat(distance) <= 0) {
        setErrorMessage('Please enter a valid distance');
        return;
      }
      
      const distanceValue = parseFloat(distance);
      const co2Value = calculateCO2(distanceValue, transportType);
      
      setEntries([...entries, {
        id: generateId(),
        type: transportType,
        description: description || `${transportType.charAt(0).toUpperCase() + transportType.slice(1)} journey (${distanceValue} km)`,
        co2Value: co2Value,
        distance: distanceValue
      }]);
    }
    
    // Reset form
    setDescription('');
    setDirectCO2('');
    setDistance('');
    setErrorMessage(null);
    setShowForm(false);
  };

  // Remove an entry
  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  // Save entries to user profile
  const saveEntries = async () => {
    if (entries.length === 0) return;
    
    setSavingStatus('saving');
    setErrorMessage(null);
    
    try {
      const entriesForSaving = entries.map(entry => {
        // Create base entry with required fields
        const baseEntry = {
          type: entry.type,
          description: entry.description,
          co2: entry.co2Value,
          date: new Date().toISOString()
        };
        
        // Only add distance if it's defined
        if (entry.distance !== undefined) {
          return {
            ...baseEntry,
            distance: entry.distance
          };
        }
        
        return baseEntry;
      });
      
      const success = await saveUserCarbonEntry(entriesForSaving);
      
      if (success) {
        setSavingStatus('success');
        setTimeout(() => {
          setSavingStatus('idle');
          setEntries([]);
        }, 2000);
      } else {
        throw new Error('Failed to save entries');
      }
    } catch (error) {
      setSavingStatus('error');
      setErrorMessage('Failed to save CO₂ entries. Please try again.');
    }
  };

  // Get transport type icon
  const getTransportIcon = (type: TransportType) => {
    switch (type) {
      case 'plane':
        return <Plane className="h-5 w-5" />;
      case 'train':
        return <Train className="h-5 w-5" />;
      case 'car':
        return <Car className="h-5 w-5" />;
    }
  };

  // Calculate total CO2
  const totalCO2 = entries.reduce((sum, entry) => sum + entry.co2Value, 0);

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Carbon Footprint</h2>
      
      <div className="space-y-6">
        {/* Mode selector buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setEntryMode('direct')}
            className={`flex-1 px-4 py-3 rounded-lg border ${
              entryMode === 'direct' 
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="font-medium">Enter Known CO₂</span>
            </div>
            <p className="text-xs mt-1 text-gray-500">
              Add emissions when you already know the CO₂ value
            </p>
          </button>
          
          <button
            type="button"
            onClick={() => setEntryMode('distance')}
            className={`flex-1 px-4 py-3 rounded-lg border ${
              entryMode === 'distance' 
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              <Plane className="h-5 w-5 mr-2" />
              <span className="font-medium">Enter Distance</span>
            </div>
            <p className="text-xs mt-1 text-gray-500">
              Calculate CO₂ from distance and transport type
            </p>
          </button>
        </div>
        
        {/* Add new entry button */}
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-primary-600 hover:border-primary-300"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Carbon Entry
          </button>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">
              {entryMode === 'direct' ? 'Add Known CO₂ Value' : 'Calculate CO₂ from Distance'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transport Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransportType('plane')}
                    className={`p-2 flex items-center justify-center rounded-md ${
                      transportType === 'plane' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <Plane className="h-4 w-4 mr-1" />
                    Plane
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportType('train')}
                    className={`p-2 flex items-center justify-center rounded-md ${
                      transportType === 'train' ? 'bg-lime-100 text-lime-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <Train className="h-4 w-4 mr-1" />
                    Train
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportType('car')}
                    className={`p-2 flex items-center justify-center rounded-md ${
                      transportType === 'car' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <Car className="h-4 w-4 mr-1" />
                    Car
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Paris to London trip"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              
              {entryMode === 'direct' ? (
                <div>
                  <label htmlFor="co2" className="block text-sm font-medium text-gray-700 mb-1">
                    CO₂ Amount (kg)
                  </label>
                  <input
                    type="number"
                    id="co2"
                    min="0"
                    step="0.1"
                    value={directCO2}
                    onChange={(e) => setDirectCO2(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="distance"
                      min="0"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md text-gray-600">
                      km
                    </span>
                  </div>
                  
                  {distance && !isNaN(parseFloat(distance)) && parseFloat(distance) > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Estimated CO₂: {Math.round(calculateCO2(parseFloat(distance), transportType))} kg
                    </div>
                  )}
                </div>
              )}
              
              {errorMessage && (
                <div className="text-sm text-error-600">
                  {errorMessage}
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setErrorMessage(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addEntry}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Display added entries */}
        {entries.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Carbon Entries</h3>
            
            <div className="space-y-3 mb-4">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
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
                        {Math.round(entry.co2Value).toLocaleString()} kg CO₂
                        {entry.distance && ` • ${entry.distance} km`}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="text-gray-500 hover:text-error-600"
                    aria-label="Remove entry"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-200">
              <div className="mb-3 sm:mb-0">
                <div className="text-sm text-gray-600">Total Carbon Footprint</div>
                <div className="text-xl font-medium text-gray-900">
                  {Math.round(totalCO2).toLocaleString()} kg CO₂
                </div>
              </div>
              
              <button
                type="button"
                onClick={saveEntries}
                disabled={loading || savingStatus === 'saving'}
                className="flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {savingStatus === 'saving' ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save to My Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Status messages */}
        {savingStatus === 'success' && (
          <div className="flex items-center p-4 bg-success-50 text-success-800 rounded-md">
            <Check className="h-5 w-5 mr-2 text-success-500" />
            Carbon entries saved successfully to your profile!
          </div>
        )}
        
        {savingStatus === 'error' && (
          <div className="flex items-center p-4 bg-error-50 text-error-800 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2 text-error-500" />
            {errorMessage || 'Something went wrong. Please try again.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAnalysis;