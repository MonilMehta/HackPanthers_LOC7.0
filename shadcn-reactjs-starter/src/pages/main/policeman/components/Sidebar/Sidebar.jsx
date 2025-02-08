import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  ClipboardList,
  Users,
  Bell,
  Map,
  BarChart3,
  Shield,
  Calendar,
  FileImage,
  Settings,
  LogOut,
  AlertTriangle,
  BadgeAlert,
  UserCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/main/dashboard",
    },
    {
      title: "Case Management",
      icon: <ClipboardList className="h-5 w-5" />,
      path: "/main/cases",
    },
    {
      title: "Evidence Center",
      icon: <FileImage className="h-5 w-5" />,
      path: "/main/evidence",
    },
    // {
    //   title: "Incident Reports",
    //   icon: <FileText className="h-5 w-5" />,
    //   path: "/main/reports",
    // },
    {
      title: "Personnel Management",
      icon: <Users className="h-5 w-5" />,
      path: "/main/personnel",
    },
    {
      title: "Duty Roster",
      icon: <Calendar className="h-5 w-5" />,
      path: "/main/roster",
    },
    {
      title: "Communication Hub",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/main/chat",
    },
    {
      title: "Emergency Alerts",
      icon: <Bell className="h-5 w-5" />,
      path: "/main/alerts",
    },
    {
      title: "GeoLocation",
      icon: <Map className="h-5 w-5" />,
      path: "/main/maps",
    },
    {
      title: "Crime Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/main/analytics",
    },
    {
      title: "Public Portal",
      icon: <Shield className="h-5 w-5" />,
      path: "/main/public-portal",
    },
    {
      title: "Wanted List",
      icon: <BadgeAlert className="h-5 w-5" />,
      path: "/main/wanted",
    },
    {
      title: "Safety Bulletins",
      icon: <AlertTriangle className="h-5 w-5" />,
      path: "/main/bulletins",
    },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-primary">Police Portal</h2>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 py-4">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActiveRoute(item.path) ? "default" : "ghost"}
              className={`w-full justify-start gap-2 ${
                isActiveRoute(item.path) 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-primary/10"
              }`}
              asChild
            >
              <Link to={item.path}>
                {item.icon}
                <span className="text-sm">{item.title}</span>
              </Link>
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2 pb-4">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <UserCircle className="h-5 w-5" />
            My Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-500 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-background/80 backdrop-blur-sm lg:block lg:w-64">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;