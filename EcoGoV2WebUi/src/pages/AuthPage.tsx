import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Department, UserRole } from "../types";

const AuthPage: React.FC = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [department, setDepartment] = useState<Department>("Tech");
  const [role, setRole] = useState<UserRole>("employee");
  const [error, setError] = useState<string | null>(null);

  // Available departments
  const departments: Department[] = ["Finance", "Industry", "Tech", "Marketing", "Operations"];

  React.useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        await register(email, password, name, jobPosition, department, role);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      // Firebase Auth error codes: https://firebase.google.com/docs/reference/js/auth#autherrorcodes
      let msg = "Authentication failed";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        msg = "Incorrect email or password.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Invalid email address format.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-card w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {isRegister ? "Register" : "Sign In"}
        </h2>
        {error && (
          <div className="bg-error-50 text-error-700 p-2 rounded text-center text-sm">
            {error}
          </div>
        )}
        {isRegister && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={name}
                onChange={e => setName(e.target.value)}
                required={isRegister}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Position
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={jobPosition}
                onChange={e => setJobPosition(e.target.value)}
                required={isRegister}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={department}
                onChange={e => setDepartment(e.target.value as Department)}
                required={isRegister}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-500"
                    name="role"
                    value="employee"
                    checked={role === 'employee'}
                    onChange={() => setRole('employee')}
                  />
                  <span className="ml-2">Employee</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-500"
                    name="role"
                    value="manager"
                    checked={role === 'manager'}
                    onChange={() => setRole('manager')}
                  />
                  <span className="ml-2">Manager</span>
                </label>
              </div>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
        >
          {isRegister ? "Register" : "Sign In"}
        </button>
        <div className="text-center">
          <button
            type="button"
            className="text-primary-600 hover:underline text-sm"
            onClick={() => setIsRegister(r => !r)}
          >
            {isRegister
              ? "Already have an account? Sign In"
              : "Don't have an account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
