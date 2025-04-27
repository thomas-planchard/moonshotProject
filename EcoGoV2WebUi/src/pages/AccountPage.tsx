import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      setProfile(snap.exists() ? snap.data() : null);
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
          <span className="font-medium text-gray-700">Email:</span> {profile.email}
        </div>
        <div>
          <span className="font-medium text-gray-700">Total Carbon:</span> {profile.totalCarbon}
        </div>
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
