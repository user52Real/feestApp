"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  startDate: Date;
  location: {
    venue: string;
  };
  attendees: {
    confirmed: number;
    total: number;
  };
  status: "upcoming" | "ongoing" | "ended";
}

export function UpcomingEvents() {
  // In a real app, this would come from an API
  const events: Event[] = [
    {
      id: "1",
      title: "Tech Conference 2024",
      startDate: new Date("2024-07-15"),
      location: { venue: "Convention Center" },
      attendees: { confirmed: 120, total: 150 },
      status: "upcoming"
    },
    // Add more events...
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: "bg-blue-100 text-blue-800",
      ongoing: "bg-green-100 text-green-800",
      ended: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Upcoming Events</CardTitle>
        <Link href="/events">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {events.map((event) => (
              <Link 
                key={event.id} 
                href={`/events/${event.id}`}
                className="block"
              >
                <div className="rounded-lg border p-3 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{event.title}</h3>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(event.startDate, "PPP")}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {format(event.startDate, "p")}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.location.venue}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {event.attendees.confirmed} / {event.attendees.total} attendees
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}