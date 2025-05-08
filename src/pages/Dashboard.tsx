
import { BarChart4, Box, CheckCircle, Clock, AlertCircle, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { mockKPIStats, mockDockets } from "../data/mockData";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const Dashboard = () => {
  const { currentUser } = useAuth();

  // Dummy data for charts
  const maintenanceTypeData = [
    { name: 'Comprehensive', value: 2 },
    { name: 'Preventive (Scheduled)', value: 3 },
    { name: 'Preventive (Unscheduled)', value: 1 },
  ];
  
  const docketStatusData = [
    { name: 'Drafted', value: 1 },
    { name: 'Submitted', value: 1 },
    { name: 'Approved', value: 2 },
    { name: 'Rejected', value: 1 },
    { name: 'Closed', value: 1 },
  ];

  const monthlyDocketData = [
    { name: 'Jan', comprehensive: 2, preventive: 4 },
    { name: 'Feb', comprehensive: 3, preventive: 3 },
    { name: 'Mar', comprehensive: 1, preventive: 5 },
    { name: 'Apr', comprehensive: 4, preventive: 2 },
    { name: 'May', comprehensive: 2, preventive: 6 },
    { name: 'Jun', comprehensive: 3, preventive: 3 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Data</Button>
          <Button>View Reports</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIStats.totalAssets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockKPIStats.activeAssets} active, {mockKPIStats.underRepairAssets} under repair, {mockKPIStats.retiredAssets} retired
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in [animation-delay:200ms]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Dockets</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIStats.openDockets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {mockKPIStats.totalDockets} total dockets
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in [animation-delay:400ms]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{100 - parseFloat(mockKPIStats.slaBreach.replace('%', ''))}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockKPIStats.slaBreach} breach rate
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in [animation-delay:600ms]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIStats.criticalDockets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              MTTR: {mockKPIStats.mttr} hours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Maintenance</CardTitle>
            <CardDescription>Comprehensive vs. Preventive maintenance dockets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyDocketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="comprehensive" fill="#3182CE" name="Comprehensive" />
                <Bar dataKey="preventive" fill="#38B2AC" name="Preventive" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Dockets Breakdown</CardTitle>
            <CardDescription>By type and status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium text-center mb-2">By Type</h3>
                <ResponsiveContainer width={150} height={150}>
                  <PieChart>
                    <Pie
                      data={maintenanceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name}) => name}
                    >
                      {maintenanceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend layout="vertical" align="center" verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium text-center mb-2">By Status</h3>
                <ResponsiveContainer width={150} height={150}>
                  <PieChart>
                    <Pie
                      data={docketStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name}) => name}
                    >
                      {docketStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend layout="vertical" align="center" verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Maintenance Dockets</CardTitle>
          <CardDescription>Latest activity across all maintenance dockets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Docket No</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>SLA Category</th>
                  <th>Status</th>
                  <th>Last Action</th>
                </tr>
              </thead>
              <tbody>
                {mockDockets.slice(0, 5).map((docket) => (
                  <tr key={docket.id}>
                    <td>{docket.docketNo}</td>
                    <td>{docket.title}</td>
                    <td>
                      {docket.type === "COMPREHENSIVE"
                        ? "Comprehensive"
                        : docket.type === "PREVENTIVE_SCHEDULED"
                        ? "Preventive (Scheduled)"
                        : "Preventive (Unscheduled)"}
                    </td>
                    <td>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        docket.slaCategory === "CRITICAL" 
                          ? "bg-red-100 text-red-800"
                          : docket.slaCategory === "NORMAL"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {docket.slaCategory.charAt(0) + docket.slaCategory.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${
                        docket.status === "DRAFTED"
                          ? "status-drafted"
                          : docket.status === "SUBMITTED"
                          ? "status-submitted"
                          : docket.status === "APPROVED"
                          ? "status-approved"
                          : docket.status === "REJECTED"
                          ? "status-rejected"
                          : "status-closed"
                      }`}>
                        {docket.status.charAt(0) + docket.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">
                      {new Date(docket.lastActionDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline">View All Dockets</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
