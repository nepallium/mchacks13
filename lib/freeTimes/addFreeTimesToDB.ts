import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getFreeTimes } from "./getFreeTimes";
import { calendar_v3 } from "googleapis";
import { TimeSlot } from "../types";

export const addFreeTimesToDB = async (
  userId: string,
  data: calendar_v3.Schema$Events,
) => {
  const events = data.items || [];

  // 1. Normalize Google Events -> TimeSlot[]
  const busySlots: TimeSlot[] = events
    .filter(
      (e) =>
        (e.start?.dateTime || e.start?.date) && (e.end?.dateTime || e.end?.date),
    )
    .map((e) => ({
      start: new Date(e.start!.dateTime || e.start!.date!),
      end: new Date(e.end!.dateTime || e.end!.date!),
    }));

  // 2. Generate the free gaps
  const freeTimes = getFreeTimes(busySlots);

  try {
    const userRef = doc(db, "users", userId);

    // 3. Serialize for Firestore
    // Firestore handles Date objects, but for ease of use in frontend JSON,
    // ISO strings are often more predictable.
    const formattedFreeTimes = freeTimes.map((slot) => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
    }));

    // 4. Upsert into Firestore
    await setDoc(
      userRef,
      {
        freeTimes: formattedFreeTimes,
        lastSyncedAt: serverTimestamp(),
      },
      { merge: true },
    ); // This ensures you don't overwrite user names, emails, etc.

    console.log(`Successfully synced availability for user: ${userId}`);
  } catch (error) {
    console.error("Firestore sync failed:", error);
    throw error;
  }
};
