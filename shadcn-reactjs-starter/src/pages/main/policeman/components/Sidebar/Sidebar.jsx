import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  MessageSquare,
  ClipboardList,
  Menu,
  LogOut,
  Settings,
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
      title: "Cases",
      icon: <ClipboardList className="h-5 w-5" />,
      path: "/main/cases",
    },
    {
      title: "Reports",
      icon: <FileText className="h-5 w-5" />,
      path: "/main/",
    },
    {
      title: "Chatting",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/main/chat",
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
                {item.title}
              </Link>
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <UserCircle className="h-5 w-5" />
            Profile
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