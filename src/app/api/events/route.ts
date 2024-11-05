import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import { Event } from "@/lib/db/models/event";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { handleApiError, ApiError } from '@/lib/api/error-handler';
import { analyzeQueryPerformance } from '@/lib/db/utils/performance';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    // Analyze query performance
    const queryPerformance = await analyzeQueryPerformance(Event, {
      organizerId: userId
    });
    console.log('Query Performance:', queryPerformance);

    await dbConnect();
    const data = await req.json();

    // Create the event and ensure we get the created document back
    const event = await Event.create({
      ...data,
      organizerId: userId,
      status: "draft",
      location: {
        venue: data.venue,
        address: data.address
      }
    });   

    // Convert the Mongoose document to a plain object and ensure _id is converted to id
    const eventObject = event.toObject();
    const responseEvent = {
      ...eventObject,
      id: eventObject._id.toString(),
    };

    revalidatePath("/events");
    revalidatePath("/dashboard");
    revalidatePath("/");

    return NextResponse.json(responseEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    return handleApiError(error);    
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const organizerId = searchParams.get("organizerId");
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    let query = {};
    if (status) query = { ...query, status };
    if (organizerId) query = { ...query, organizerId };

    // Analyze query performance
    const queryPerformance = await analyzeQueryPerformance(Event, {
      organizerId: userId
    });

    console.log('Query Performance:', queryPerformance);

    const events = await Event.find(query).sort({ createdAt: -1 }).limit(100);

    // Serialize the events
    const serializedEvents = events.map(event => {
      const eventObj = event.toObject();
      return {
        id: eventObj._id.toString(),
        title: eventObj.title,
        description: eventObj.description,
        startDate: eventObj.startDate.toISOString(),
        endDate: eventObj.endDate.toISOString(),
        location: {
          venue: eventObj.location?.venue || '',
          address: eventObj.location?.address || '',
        },
        capacity: eventObj.capacity,
        status: eventObj.status,
        visibility: eventObj.visibility,
        organizerId: eventObj.organizerId,
        coHosts: eventObj.coHosts || [],
      };
    });

    return NextResponse.json(serializedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
