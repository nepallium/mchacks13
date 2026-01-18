import { TimeSlot } from "../types";

/**
 * gets free times.
 * @param busyEvents clean array with only start and end
 * @returns
 */
export const getFreeTimes = (busyEvents: TimeSlot[]): TimeSlot[] => {
  const freeSlots: TimeSlot[] = [];
  const now = new Date();

  // Ensure they are sorted (crucial for the merging logic)
  const sortedEvents = [...busyEvents].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() + i);

    const dayStart = new Date(currentDate);
    dayStart.setHours(8, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(21, 0, 0, 0);

    // Filter and Merge busy events for JUST this day
    const busyToday = sortedEvents.filter(
      (e) => e.end > dayStart && e.start < dayEnd,
    );

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

export const getMutualFreeTimes = (
  cal1: TimeSlot[],
  cal2: TimeSlot[],
): TimeSlot[] => {
  // Combine both calendars' busy slots
  const combinedBusySlots: TimeSlot[] = [...cal1, ...cal2];

  // Return the free times
  return getFreeTimes(combinedBusySlots);
};
