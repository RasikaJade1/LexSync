import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

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

// We separate the main content into an inner component so we can use the `useNavigate` hook
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserRole(localStorage.getItem("role"));
    navigate("/dashboard"); // Route to dashboard after successful login
  };

  const handleSignOut = () => {
    localStorage.clear(); // Clear token and role
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/"); // Route back to login page
  };

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