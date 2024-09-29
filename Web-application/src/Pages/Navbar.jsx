import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  MapPin,
  AlertTriangle,
  UserCheck,
  Calendar,
  LayoutDashboard,
  AlertOctagon,
  Bus,
  Users,
  UserCircle,
  LogOut,
  User,
  Mail,
  Phone,
  Briefcase,
  LocateFixed,
} from "lucide-react";
import { Link } from "react-router-dom";
import NotificationCenter from "@/utils/notification";
import { Toaster } from "@/components/ui/toaster";

export default function Navbar({ children }) {
  const [activeView, setActiveView] = useState("overview");
  const [busCount, setBusCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [emergencyCount, setEmergencyCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setBusCount(150);
    setDriverCount(200);
    setEmergencyCount(3);

    const socket = new WebSocket("ws://your-backend-url");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Update state based on received data
    };

    return () => socket.close();
  }, []);

  const navItems = [
    { name: "Overview"},
    { name: "Route Details"},
    { name: "Driver Management"},
    { name: "Driver Details"},
    { name: "Emergency Center"},
    { name: "Schedule"},
  ];

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

  // Mock admin data
  const adminData = {
    name: "Admin User",
    email: "admin@example.com",
    role: "System Administrator",
    lastLogin: "2023-06-15 09:30 AM",
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <Toaster/>
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">DTC Controller</h1>
        </div>
        <nav className="mt-8">
          <Link to={"/"}>
            <Button
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-white hover:bg-gray-700`}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              {navItems[0].name}
            </Button>
          </Link>
          <Link to={"/routeDetail"}>
            <Button
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-white hover:bg-gray-700`}
            >
              <LocateFixed className="w-5 h-5 mr-2" />
              {navItems[1].name}
            </Button>
          </Link>
          <Link to={"/driverManagement"}>
            <Button
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-white hover:bg-gray-700`}
            >
              <User className="w-5 h-5 mr-2" />
              {navItems[2].name}
            </Button>
          </Link>
          <Link to={"/driverDetail"}>
            <Button
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-white hover:bg-gray-700`}
            >
              <UserCircle className="w-5 h-5 mr-2" />
              {navItems[3].name}
            </Button>
          </Link>
          <Link to={"/emergency"}>
            <Button
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-white hover:bg-gray-700`}
            >
              <AlertOctagon className="w-5 h-5 mr-2" />
              {navItems[4].name}
            </Button>
          </Link>    
          <Link to={"/schedule"}>
            <Button
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-white hover:bg-gray-700`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              {navItems[5].name}
            </Button>
          </Link>    
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {navItems.find((item) => item.view === activeView)?.name}
            </h2>
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="Admin"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="grid gap-4">
                    <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <User className="mr-2 h-4 w-4" /> Profile
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Admin Profile</SheetTitle>
                          <SheetDescription>
                            View and manage your profile information
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Name
                              </p>
                              <p className="mt-1 text-sm text-gray-900">
                                John Admin
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Email
                              </p>
                              <p className="mt-1 text-sm text-gray-900">
                                john.admin@dtc.com
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Phone
                              </p>
                              <p className="mt-1 text-sm text-gray-900">
                                +1 (555) 123-4567
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Role
                              </p>
                              <p className="mt-1 text-sm text-gray-900">
                                Senior Administrator
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Last Login
                              </p>
                              <p className="mt-1 text-sm text-gray-900">
                                2023-06-15 09:30 AM
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button className="w-full">Edit Profile</Button>
                        </div>
                        <SheetClose asChild>
                          <Button variant="outline" className="mt-4 w-full">
                            Close
                          </Button>
                        </SheetClose>
                      </SheetContent>
                    </Sheet>
                    <Separator />
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
