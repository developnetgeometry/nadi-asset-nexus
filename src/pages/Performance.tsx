
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
 } from "recharts";
import { Download, Calendar } from "lucide-react";

const Performance = () => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Dummy data for charts
  const slaData = [
    { name: 'Jan', compliance: 95, breach: 5 },
    { name: 'Feb', compliance: 92, breach: 8 },
    { name: 'Mar', compliance: 88, breach: 12 },
    { name: 'Apr', compliance: 90, breach: 10 },
    { name: 'May', compliance: 94, breach: 6 },
    { name: 'Jun', compliance: 89, breach: 11 },
  ];

  const mttrData = [
    { name: 'ICT', value: 24 },
    { name: 'Electrical', value: 36 },
    { name: 'Plumbing', value: 18 },
    { name: 'HVAC', value: 42 },
    { name: 'Other', value: 30 },
  ];

  const docketData = [
    { name: 'Jan', preventive: 15, comprehensive: 5 },
    { name: 'Feb', preventive: 18, comprehensive: 7 },
    { name: 'Mar', preventive: 14, comprehensive: 9 },
    { name: 'Apr', preventive: 16, comprehensive: 6 },
    { name: 'May', preventive: 19, comprehensive: 8 },
    { name: 'Jun', preventive: 22, comprehensive: 10 },
  ];

  const vendorPerformanceData = [
    { name: 'Tech Solutions', sla: 96, response: 90, feedback: 88 },
    { name: 'Maintenance Pro', sla: 92, response: 88, feedback: 85 },
    { name: 'Fix-It Systems', sla: 98, response: 95, feedback: 92 },
    { name: 'Quick Repair', sla: 88, response: 94, feedback: 82 },
  ];

  const assetUtilizationData = [
    { name: 'Servers', used: 82, idle: 18 },
    { name: 'Network', used: 90, idle: 10 },
    { name: 'HVAC', used: 65, idle: 35 },
    { name: 'UPS', used: 40, idle: 60 },
    { name: 'Generators', used: 25, idle: 75 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance Monitoring</h1>
          <p className="text-muted-foreground">
            Track KPIs, SLA compliance, and maintenance performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sla" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sla">SLA Monitoring</TabsTrigger>
          <TabsTrigger value="kpi">Maintenance KPIs</TabsTrigger>
          <TabsTrigger value="asset">Asset Utilization</TabsTrigger>
          <TabsTrigger value="vendor">Vendor Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sla">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>SLA Compliance Trend</CardTitle>
                <CardDescription>Monthly SLA compliance vs. breach percentage</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={slaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="compliance" stroke="#38B2AC" name="Compliance %" />
                    <Line type="monotone" dataKey="breach" stroke="#F56565" name="Breach %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SLA Performance by Category</CardTitle>
                <CardDescription>Average response time by priority</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Critical", value: 4 },
                        { name: "Normal", value: 12 },
                        { name: "Low", value: 24 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kpi">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Maintenance Dockets Monthly</CardTitle>
                <CardDescription>Number of preventive vs. comprehensive maintenance</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={docketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="preventive" fill="#38B2AC" name="Preventive" />
                    <Bar dataKey="comprehensive" fill="#3182CE" name="Comprehensive" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mean Time To Repair</CardTitle>
                <CardDescription>MTTR by maintenance category (hours)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={mttrData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#805AD5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="asset">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Asset Utilization</CardTitle>
                <CardDescription>Used vs. idle time percentage by asset category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetUtilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="used" stackId="a" fill="#38B2AC" name="Utilized %" />
                    <Bar dataKey="idle" stackId="a" fill="#E2E8F0" name="Idle %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Frequency</CardTitle>
                <CardDescription>Average number of maintenance events per asset category</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "IT", value: 12 },
                        { name: "Electrical", value: 8 },
                        { name: "HVAC", value: 6 },
                        { name: "Security", value: 4 },
                        { name: "Other", value: 2 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {[0, 1, 2, 3, 4].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendor">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Comparison</CardTitle>
              <CardDescription>Comparison of SLA compliance, response time, and feedback scores</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sla" fill="#38B2AC" name="SLA Compliance %" />
                  <Bar dataKey="response" fill="#3182CE" name="Response Time Score" />
                  <Bar dataKey="feedback" fill="#805AD5" name="Feedback Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;
