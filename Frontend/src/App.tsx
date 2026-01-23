import React from "react";
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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] =
    React.useState(false);
  const [currentPage, setCurrentPage] =
    React.useState("dashboard");

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
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
    >
      {renderCurrentPage()}
    </Layout>
  );
}