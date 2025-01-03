// src/app/(dashboard)/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "@/components/dashboard/charts";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { EventStats } from "@/components/dashboard/event-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import dbConnect from "@/lib/db/connection";
import { Event } from "@/lib/db/models/event";
import { Guest } from "@/lib/db/models/guest";
import AdUnit from "@/components/ads/AdUnit";

async function getEventStats(userId: string) {
  await dbConnect();

  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  try {
    const [
      totalEvents,
      upcomingEvents,
      totalAttendees,
      checkedInAttendees
    ] = await Promise.all([
      // Total events
      Event.countDocuments({ organizerId: userId }),
      
      // Upcoming events (next 30 days)
      Event.countDocuments({
        organizerId: userId,
        startDate: { $gte: now, $lte: thirtyDaysFromNow }
      }),
      
      // Total confirmed attendees across all events
      Guest.countDocuments({
        eventId: { 
          $in: (await Event.find({ organizerId: userId }).select('_id'))
            .map(event => event._id)
        },
        status: "confirmed"
      }),
      
      // Total checked-in attendees
      Guest.countDocuments({
        eventId: { 
          $in: (await Event.find({ organizerId: userId }).select('_id'))
            .map(event => event._id)
        },
        checkedIn: true
      })
    ]);

    const averageAttendance = totalAttendees > 0 
      ? Math.round((checkedInAttendees / totalAttendees) * 100)
      : 0;

    return {
      totalEvents,
      upcomingEvents,
      totalAttendees,
      averageAttendance
    };
  } catch (error) {
    console.error("Error fetching event stats:", error);
    return {
      totalEvents: 0,
      upcomingEvents: 0,
      totalAttendees: 0,
      averageAttendance: 0
    };
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const stats = await getEventStats(userId);

  return (
    <div className="flex gap-4">
      {/* Left Sidebar for Ad */}
      {/* <div className="hidden xl:block w-[100px] shrink-0">
        <AdUnit 
          slot="30002"
          format="vertical"
          style={{ 
            position: "sticky",
            top: "2rem",
            minHeight: "600px",
            width: "160px",
            margin: "",
            display: "flex"
          }}
        />
      </div> */}

      {/* Main Dashboard Content */}
      <div className="flex-1 space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EventStats stats={stats} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="md:col-span-4">
            <DashboardCharts />
          </div>
          <div className="md:col-span-3">
            <UpcomingEvents />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>
        <div className="xl:block item-center justify-items-center justify-center shrink-0">
            <AdUnit 
              slot="30002"
              format="vertical"
              style={{ 
                position: "sticky",
                top: "2rem",
                minHeight: "100px",
                width: "400px",
                margin: "0 auto",
                display: "flex"
              }}
            />
      </div> 
      </div>      
    </div>
  );
}