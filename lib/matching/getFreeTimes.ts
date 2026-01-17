/*
{
      kind: "calendar#event",
      etag: '"3375663484944000"',
      id: "60o3v2n9v3gjasvmb8uo0g239u",
      status: "confirmed",
      htmlLink:
        "https://www.google.com/calendar/event?eid=NjBvM3Yybjl2M2dqYXN2bWI4dW8wZzIzOXUgOTEzZTQxZTBhMWFiOTBmZGQ1ZjUwYjJjYTZlMTQ0NzgyZGM3MmIyNWYzZjAwZjgzZGUxYTdlNjlkZDRiNWRhZkBn",
      created: "2023-06-27T02:09:02.000Z",
      updated: "2023-06-27T02:09:02.472Z",
      summary: "driving school hw",
      creator: {
        email: "alexhuangmc@gmail.com",
      },
      organizer: {
        email:
          "913e41e0a1ab90fdd5f50b2ca6e144782dc72b25f3f00f83de1a7e69dd4b5daf@group.calendar.google.com",
        displayName: "📚 School Work",
        self: true,
      },
      start: {
        dateTime: "2023-06-28T21:00:00Z",
        timeZone: "America/Toronto",
      },
      end: {
        dateTime: "2023-06-28T22:00:00Z",
        timeZone: "America/Toronto",
      },
      iCalUID: "60o3v2n9v3gjasvmb8uo0g239u@google.com",
      sequence: 0,
      reminders: {
        useDefault: true,
      },
      eventType: "default",
    },
*/

type GoogleCalendarEvent = {
  start: { dateTime: string };
  end: { dateTime: string };
};

interface TimeSlot {
  start: Date;
  end: Date;
}

type Event = { start: { dateTime: string }; end: { dateTime: string } };
type CalendarResponse = { items: Event[] };
interface TimeSlot {
  start: Date;
  end: Date;
}

export const getMutualFreeTimes = (
  cal1: CalendarResponse,
  cal2: CalendarResponse,
): TimeSlot[] => {
  const freeSlots: TimeSlot[] = [];
  const now = new Date();

  // 1. Combine all events from both calendars into one list
  const allEvents = [...cal1.items, ...cal2.items]
    .map((e) => ({
      start: new Date(e.start.dateTime),
      end: new Date(e.end.dateTime),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // 2. Loop through the next 7 days
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() + i);

    // Define the "Active Window" for this specific day (8 AM - 9 PM)
    const dayStart = new Date(currentDate);
    dayStart.setHours(8, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(21, 0, 0, 0);

    // 3. Filter and Merge busy events for JUST this day
    const busyToday = allEvents.filter((e) => e.end > dayStart && e.start < dayEnd);

    const mergedBusy: TimeSlot[] = [];
    if (busyToday.length > 0) {
      let current = { ...busyToday[0] };
      for (let j = 1; j < busyToday.length; j++) {
        if (busyToday[j].start <= current.end) {
          current.end = new Date(
            Math.max(current.end.getTime(), busyToday[j].end.getTime()),
          );
        } else {
          mergedBusy.push(current);
          current = { ...busyToday[j] };
        }
      }
      mergedBusy.push(current);
    }

    // 4. Find the white space (Free Time) in the 8AM-9PM window
    let pointer = dayStart;

    mergedBusy.forEach((busy) => {
      if (busy.start > pointer) {
        freeSlots.push({ start: new Date(pointer), end: new Date(busy.start) });
      }
      if (busy.end > pointer) pointer = busy.end;
    });

    if (pointer < dayEnd) {
      freeSlots.push({ start: new Date(pointer), end: new Date(dayEnd) });
    }
  }

  return freeSlots;
};
