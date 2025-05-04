import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserProfile } from "../types";

const AccountPage: React.FC = () => {
  const { user, logout, isManager } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      
      if (snap.exists()) {
        const userData = snap.data();
        setProfile({
          id: user.uid,
          name: userData.name || user.displayName || 'User',
          email: userData.email || user.email || '',
          jobPosition: userData.jobPosition || '',
          department: userData.department || 'Tech',
          role: userData.role || 'employee',
          totalCarbon: userData.totalCarbon || 0
        });
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!profile) {
    return <div className="container mx-auto p-6">No account data found.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Account Overview</h1>
      <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <div>
          <span className="font-medium text-gray-700">Name:</span> {profile.name}
        </div>
        <div>
          <span className="font-medium text-gray-700">Job Position:</span> {profile.jobPosition}
        </div>
        <div>
          <span className="font-medium text-gray-700">Department:</span> {profile.department}
        </div>
        <div>
          <span className="font-medium text-gray-700">Role:</span> 
          <span className={`ml-1 ${profile.role === 'manager' ? 'text-primary-600 font-medium' : ''}`}>
            {profile.role === 'manager' ? 'Manager' : 'Employee'}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Email:</span> {profile.email}
        </div>
        <div>
          <span className="font-medium text-gray-700">Total Carbon:</span> {profile.totalCarbon.toLocaleString()} kg CO₂
        </div>
        
        {isManager() && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-primary-600 font-medium mb-1">Manager Access</p>
            <p className="text-sm text-gray-600 mb-2">
              As a manager, you have access to the admin dashboard where you can view carbon emissions for employees in your department.
            </p>
            <a 
              href="/admin" 
              className="inline-block px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
            >
              Go to Admin Dashboard
            </a>
          </div>
        )}
        
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
