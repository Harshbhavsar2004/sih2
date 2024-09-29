import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  LayoutDashboard,
  Bus,
  Users,
  MapPin,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "./Navbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DTCDashboard() {
  const [passengerData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Passengers",
        data: [120000, 150000, 140000, 160000, 180000, 130000, 100000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  const recentUpdates = [
    {
      id: "DL1PC1234",
      route: "44",
      status: "On Time",
      location: "Connaught Place",
    },
    { id: "DL1PC5678", route: "12", status: "Delayed", location: "India Gate" },
    {
      id: "DL1PC9101",
      route: "32",
      status: "On Time",
      location: "Lajpat Nagar",
    },
  ];

  const topRoutes = [
    { route: "44", passengers: 12000, revenue: "₹60,000" },
    { route: "12", passengers: 10000, revenue: "₹50,000" },
    { route: "32", passengers: 9000, revenue: "₹45,000" },
  ];

  return (
    <Navbar>
      <div className="flex bg-gray-100">
        {/* Main content */}
        <main className="flex-1 p-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹4,52,31,890</div>
                <p className="text-xs text-muted-foreground">
                  +10.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Buses
                </CardTitle>
                <Bus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,234</div>
                <p className="text-xs text-muted-foreground">
                  +2% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  On-Time Performance
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground">
                  +2.5% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Passenger Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Daily Passenger Count</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={passengerData} options={{ responsive: true }} />
            </CardContent>
          </Card>

          {/* Recent Updates and Top Routes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bus Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUpdates.map((update) => (
                    <div key={update.id} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Bus {update.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Route {update.route} - {update.status} at{" "}
                          {update.location}
                        </p>
                      </div>
                      <div
                        className={`ml-auto text-sm font-medium ${
                          update.status === "On Time"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {update.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Bus Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topRoutes.map((route) => (
                    <div key={route.route} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Route {route.route}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {route.passengers.toLocaleString()} passengers
                        </p>
                      </div>
                      <div className="ml-auto font-medium">{route.revenue}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </Navbar>
  );
}
