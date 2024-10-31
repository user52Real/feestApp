import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serializeEvent(event: any) {
  if (!event) return null;
  
  const eventObj = event.toObject ? event.toObject() : event;
  
  return {
    id: eventObj._id.toString(),
    title: eventObj.title,
    description: eventObj.description,
    startDate: new Date(eventObj.startDate).toISOString(),
    endDate: new Date(eventObj.endDate).toISOString(),
    location: {
      venue: eventObj.location?.venue || '',
      address: eventObj.location?.address || '',
      coordinates: eventObj.location?.coordinates || null,
    },
    capacity: eventObj.capacity,
    status: eventObj.status,
    visibility: eventObj.visibility,
    organizerId: eventObj.organizerId,
    coHosts: eventObj.coHosts || [],
    recurring: eventObj.recurring || null,
    createdAt: new Date(eventObj.createdAt).toISOString(),
    updatedAt: new Date(eventObj.updatedAt).toISOString(),
    attendees: {
      confirmed: 0,
      waitlist: 0,
    },
  };
}