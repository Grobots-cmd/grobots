import { NextResponse } from "next/server";

// Mock events data since the import was missing
const eventsData = {
  events: [
    {
      id: 1,
      title: "Robotics Workshop 2024",
      description: "Learn the basics of robotics and automation",
      date: "2024-03-15",
      location: "Main Campus",
      image: "/images/workshop.jpg",
      capacity: 50,
      registered: 35,
      agenda: [
        { topic: "Introduction to Robotics", time: "9:00 AM - 10:00 AM" },
        { topic: "Hands-on Practice", time: "10:00 AM - 12:00 PM" },
        { topic: "Q&A Session", time: "12:00 PM - 1:00 PM" }
      ]
    },
    {
      id: 2,
      title: "BattleBots Competition",
      description: "Annual robot fighting competition",
      date: "2024-04-20",
      location: "Engineering Lab",
      image: "/images/battlebots.jpg",
      capacity: 20,
      registered: 18,
      agenda: [
        { topic: "Safety Briefing", time: "8:00 AM - 8:30 AM" },
        { topic: "Preliminary Rounds", time: "8:30 AM - 11:00 AM" },
        { topic: "Final Championship", time: "11:00 AM - 2:00 PM" }
      ]
    }
  ]
};

export async function GET(request) {
  console.log('📅 Events API: GET request received');
  console.log('🔗 Request URL:', request.url);
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const status = searchParams.get("status");

    console.log('📋 Query parameters:', { id, limit, page, status });

    // If ID is provided, fetch specific event
    if (id) {
      console.log('🔍 Fetching event by ID:', id);
      const event = eventsData.events.find(e => e.id === parseInt(id));

      if (!event) {
        console.log('❌ Event not found with ID:', id);
        return NextResponse.json(
          { error: "Event not found" },
          { status: 404 }
        );
      }

      // Transform to admin format
      const transformedEvent = {
        id: event.id,
        name: event.title,
        description: event.description,
        startDate: event.date,
        endDate: event.date, // Using same date for now
        location: event.location,
        status: event.registered >= event.capacity ? 'Full' : 'Active',
        registrations: event.registered,
        maxCapacity: event.capacity,
        poster: event.image,
        subEvents: event.agenda ? event.agenda.map((item, index) => ({
          id: index + 1,
          name: item.topic,
          description: item.time,
          maxTeams: 10,
          registered: Math.floor(Math.random() * 10)
        })) : []
      };

      console.log('✅ Event found and transformed:', {
        id: transformedEvent.id,
        name: transformedEvent.name,
        status: transformedEvent.status
      });

      return NextResponse.json(
        {
          message: "Event retrieved successfully",
          event: transformedEvent,
        },
        { status: 200 }
      );
    }

    // Transform all events to admin format
    console.log('📊 Transforming all events to admin format');
    const transformedEvents = eventsData.events.map(event => ({
      id: event.id,
      name: event.title,
      description: event.description,
      startDate: event.date,
      endDate: event.date, // Using same date for now
      location: event.location,
      status: event.registered >= event.capacity ? 'Full' : 'Active',
      registrations: event.registered,
      maxCapacity: event.capacity,
      poster: event.image,
      subEvents: event.agenda ? event.agenda.map((item, index) => ({
        id: index + 1,
        name: item.topic,
        description: item.time,
        maxTeams: 10,
        registered: Math.floor(Math.random() * 10)
      })) : []
    }));

    // Apply status filter
    let filteredEvents = transformedEvents;
    if (status && status !== 'All') {
      filteredEvents = transformedEvents.filter(event => event.status === status);
      console.log('🔍 Applied status filter:', { status, filteredCount: filteredEvents.length });
    }

    // Apply pagination
    let paginatedEvents = filteredEvents;
    let total = filteredEvents.length;

    if (limit) {
      const limitNum = parseInt(limit);
      const pageNum = parseInt(page) || 1;
      const skip = (pageNum - 1) * limitNum;

      paginatedEvents = filteredEvents.slice(skip, skip + limitNum);
      console.log('📄 Pagination applied:', { page: pageNum, limit: limitNum, skip, total, paginatedCount: paginatedEvents.length });
    }

    console.log('✅ Events processed successfully:', {
      totalEvents: eventsData.events.length,
      transformedCount: transformedEvents.length,
      filteredCount: filteredEvents.length,
      paginatedCount: paginatedEvents.length
    });

    return NextResponse.json(
      {
        message: "Events retrieved successfully",
        events: paginatedEvents,
        total,
        ...(limit && {
          pagination: {
            page: parseInt(page) || 1,
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit)),
          },
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching events:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
