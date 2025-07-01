import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  FileText, 
  List, 
  PieChart, 
  Settings, 
  User,
  Menu,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/contexts/SidebarContext";

const navigation = [
  { name: "Dashboard", href: "/", icon: PieChart },
  { name: "All Complaints", href: "/complaints", icon: List },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  return (
    <aside className={cn(
      "bg-white shadow-lg flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "border-b border-gray-200 flex items-center",
        isCollapsed ? "p-3 justify-center" : "p-6 justify-between"
      )}>
        {!isCollapsed && (
          <img src="/bn-logo.png" alt="BN Logo" className="h-24 object-contain" />
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
      
      <nav className={cn(
        "flex-1 py-6 space-y-2",
        isCollapsed ? "px-2" : "px-4"
      )}>
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center rounded-lg font-medium transition-colors cursor-pointer",
                  isCollapsed ? "px-3 py-3 justify-center" : "px-4 py-3",
                  isActive
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  !isCollapsed && "mr-3"
                )} />
                {!isCollapsed && item.name}
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className={cn(
        "border-t border-gray-200",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <div className={cn(
          "flex items-center",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
            <User className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
