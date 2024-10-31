// src/components/dashboard/charts.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ChartData {
  attendanceData: {
    name: string;
    attendees: number;
    capacity: number;
  }[];
  registrationData: {
    name: string;
    registrations: number;
  }[];
  eventTypeData: {
    name: string;
    value: number;
  }[];
}

export function DashboardCharts() {
  // In a real app, this would come from an API
  const data: ChartData = {
    attendanceData: [
      { name: 'Jan', attendees: 85, capacity: 100 },
      { name: 'Feb', attendees: 92, capacity: 100 },
      { name: 'Mar', attendees: 88, capacity: 100 },
      { name: 'Apr', attendees: 95, capacity: 100 },
      { name: 'May', attendees: 90, capacity: 100 },
      { name: 'Jun', attendees: 94, capacity: 100 },
    ],
    registrationData: [
      { name: 'Week 1', registrations: 24 },
      { name: 'Week 2', registrations: 36 },
      { name: 'Week 3', registrations: 42 },
      { name: 'Week 4', registrations: 50 },
    ],
    eventTypeData: [
      { name: 'Conference', value: 35 },
      { name: 'Workshop', value: 25 },
      { name: 'Seminar', value: 20 },
      { name: 'Networking', value: 20 },
    ],
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="types">Event Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="attendees" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="capacity" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="registrations" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="registrations" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="types" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.eventTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}