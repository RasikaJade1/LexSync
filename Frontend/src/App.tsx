import React, { useEffect, useState } from "react";
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
import { AdminRegisterStaff } from "./components/AdminRegisterStaff"; // 1. Import the new component

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userRole, setUserRole] = useState<string | null>(null); // 2. Track the role

  // 3. Check for existing session on mount
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
    setUserRole(localStorage.getItem("role")); // Update role state after login
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleSignOut = () => {
    localStorage.clear(); // Clear token and role
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentPage("dashboard");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "cases":
        return <CaseManagement />;
      case "tasks":
        return <TaskManagement />;
      case "documents":
        return <DocumentManagement />;
      case "appointments":
        return <AppointmentsCalendar />;
      case "billing":
        return <BillingQuotations />;
      case "ai-summarizer":
        return <AISummarizer />;
      case "profile":
        return <Profile />;
      case "manage-staff": // 4. Add the new route case
        return userRole === "admin" ? <AdminRegisterStaff /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onSignOut={handleSignOut}
      userRole={userRole} // 5. Pass role to Layout so it can show/hide sidebar buttons
    >
      {renderCurrentPage()}
    </Layout>
  );
}