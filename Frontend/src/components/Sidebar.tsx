import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderOpen, 
  Calendar,
  CreditCard,
  Brain,
  Gavel,
  Users // Added Users icon for Manage Staff
} from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string | null; // Added userRole to props
}

export function Sidebar({ currentPage, onNavigate, userRole }: SidebarProps) {
  // Define standard menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: Gavel },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'billing', label: 'Billing & Quotations', icon: CreditCard },
    { id: 'ai-summarizer', label: 'AI Summarizer', icon: Brain },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">LexSync</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-10 ${
                isActive 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}

        {/* ADMIN ONLY SECTION */}
        {userRole === 'admin' && (
          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Admin Controls
            </p>
            <Button
              variant={currentPage === 'manage-staff' ? "default" : "ghost"}
              className={`w-full justify-start h-10 ${
                currentPage === 'manage-staff' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700'
              }`}
              onClick={() => onNavigate('manage-staff')}
            >
              <Users className="mr-3 h-4 w-4" />
              Manage Staff
            </Button>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          LexSync v1.0
        </div>
      </div>
    </div>
  );
}