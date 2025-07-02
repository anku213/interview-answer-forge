
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, HelpCircle, Code, User, MessageSquare, Settings, Building2, Calendar, FileText, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Daily Challenge",
    url: "/daily-challenge",
    icon: Calendar,
    badge: "New",
  },
  {
    title: "Question Module",
    url: "/questions",
    icon: HelpCircle,
    badge: null,
  },
  {
    title: "Company Questions",
    url: "/company-questions",
    icon: Building2,
    badge: null,
  },
  {
    title: "AI Interview",
    url: "/ai-interview",
    icon: MessageSquare,
    badge: "Beta",
  },
  {
    title: "Resume Analyzer",
    url: "/resume-analyzer",
    icon: FileText,
    badge: "Pro",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    badge: null,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const isActive = (url: string) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className={cn("border-r border-gray-200 bg-white transition-all duration-300", isCollapsed ? "w-16" : "w-60")}>
      <SidebarHeader className={cn("p-4 border-b border-gray-100", isCollapsed && "px-2 py-4")}>
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 truncate">Interview Prep</h2>
              <p className="text-xs text-gray-500">Navigation</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <Code className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className={cn("px-2 py-4", isCollapsed && "px-1")}>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn("space-y-1", isCollapsed && "space-y-2")}>
              {menuItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation(item.url)}
                      className={cn(
                        "w-full group relative rounded-xl transition-all duration-200 hover:bg-gray-50",
                        active && "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-500",
                        isCollapsed ? "justify-center p-3 h-12" : "justify-start p-3"
                      )}
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <div className={cn(
                        "flex items-center",
                        isCollapsed ? "justify-center" : "justify-start w-full"
                      )}>
                        <item.icon className={cn(
                          "flex-shrink-0 transition-colors duration-200",
                          active ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700",
                          isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
                        )} />
                        
                        {!isCollapsed && (
                          <>
                            <span className="truncate font-medium text-sm">
                              {item.title}
                            </span>
                            
                            <div className="ml-auto flex items-center space-x-2">
                              {item.badge && (
                                <Badge 
                                  variant={item.badge === "Pro" ? "default" : "secondary"}
                                  className={cn(
                                    "text-xs px-2 py-0.5 rounded-full",
                                    item.badge === "Pro" && "bg-gradient-to-r from-amber-400 to-orange-500 text-white",
                                    item.badge === "Beta" && "bg-blue-100 text-blue-700",
                                    item.badge === "New" && "bg-green-100 text-green-700"
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              
                              {active && (
                                <ChevronRight className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("p-4 border-t border-gray-100", isCollapsed && "px-2 py-4")}>
        {user && (
          <div className={cn(
            "flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200",
            isCollapsed ? "justify-center" : "space-x-3"
          )}>
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">Logged in</p>
              </div>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
