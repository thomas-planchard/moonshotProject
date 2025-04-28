import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { X, Plus, User, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const TripForm: React.FC = () => {
  const navigate = useNavigate();
  const { createTrip, loading, error } = useApi();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  // State for contributor selection
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
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
          u => u.id !== user?.uid && !selectedContributors.some(c => c.id === u.id)
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
    setSelectedContributors(prev => [
      ...prev, 
      { 
        id: contributor.id, 
        name: contributor.name, 
        email: contributor.email 
      }
    ]);
    setSearchResults([]);
    setSearchEmail('');
  };

  // Remove contributor from selected list
  const removeContributor = (id: string) => {
    setSelectedContributors(prev => prev.filter(c => c.id !== id));
  };
  
  const validateForm = () => {
    const errors = {
      name: '',
      startDate: '',
      endDate: '',
    };
    let isValid = true;
    
    if (!formData.name.trim()) {
      errors.name = 'Trip name is required';
      isValid = false;
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
      isValid = false;
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
      isValid = false;
    } else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const trip = await createTrip({
      ...formData,
      contributors: selectedContributors
    });
    if (trip) {
      navigate(`/trips/${trip.id}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New Trip</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Existing form fields */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Trip Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${
              formErrors.name ? 'border-error-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Business Trip to New York"
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-error-600">{formErrors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Details about the purpose of the trip"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${
                formErrors.startDate ? 'border-error-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {formErrors.startDate && (
              <p className="mt-1 text-sm text-error-600">{formErrors.startDate}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${
                formErrors.endDate ? 'border-error-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {formErrors.endDate && (
              <p className="mt-1 text-sm text-error-600">{formErrors.endDate}</p>
            )}
          </div>
        </div>
        
        {/* New contributor section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contributors
          </label>
          <div className="space-y-4">
            {/* Selected contributors display */}
            {selectedContributors.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedContributors.map(contributor => (
                  <div 
                    key={contributor.id}
                    className="flex items-center bg-primary-50 text-primary-700 py-1 px-3 rounded-full text-sm"
                  >
                    <span className="mr-1">{contributor.name}</span>
                    <button
                      type="button"
                      onClick={() => removeContributor(contributor.id)}
                      className="text-primary-500 hover:text-primary-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Contributor search */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Search user by email"
                    className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSearchUsers}
                  disabled={isSearching}
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
              <div className="border rounded-md divide-y">
                {searchResults.map(result => (
                  <div 
                    key={result.id} 
                    className="p-2 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="bg-secondary-100 text-secondary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <User className="h-4 w-4" />
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
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/trips')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm mr-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-500 text-white rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;