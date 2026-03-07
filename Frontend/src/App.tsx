import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { LoginPage } from "./components/LoginPage";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { CaseManagement } from "./components/CaseManagement";
import { TaskManagement } from "./components/TaskManagement";
import { DocumentManagement } from "./components/DocumentManagement";
import { AppointmentsCalendar } from "./components/AppointmentsCalendar";
import { BillingQuotations } from "./components/BillingQuotations";
import { AISummarizer } from "./components/AISummarizer";
import { Profile } from "./components/Profile";
import { AdminRegisterStaff } from "./components/AdminRegisterStaff";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // NEW: Add a loading state so the app doesn't flash the login screen
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    // After checking local storage, tell React we are done checking
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserRole(localStorage.getItem("role"));
    navigate("/dashboard"); 
  };

  const handleSignOut = () => {
    localStorage.clear(); 
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/"); 
  };

  // NEW: Show a blank screen (or a spinner) while checking local storage
  if (isCheckingAuth) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading LexSync...</div>;
  }

  // 1. If not logged in, force the user to see ONLY the Login Page
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    );
  }

  // 2. If logged in, render the Layout and all protected routes
  return (
    <Layout onSignOut={handleSignOut} userRole={userRole}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cases" element={<CaseManagement />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/documents" element={<DocumentManagement />} />
        <Route path="/appointments" element={<AppointmentsCalendar />} />
        <Route path="/billing" element={<BillingQuotations />} />
        <Route path="/ai-summarizer" element={<AISummarizer />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Protected Admin Route */}
        <Route 
          path="/manage-staff" 
          element={userRole === "admin" ? <AdminRegisterStaff /> : <Navigate to="/dashboard" replace />} 
        />

        {/* Catch-all: If they type an invalid URL, send them back to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

// Wrap the entire app in BrowserRouter exactly once
export default function App() {
  return <AppContent />;
}