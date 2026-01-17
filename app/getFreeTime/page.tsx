"use client";

import { sampleCalendar1, sampleCalendar2 } from "@/assets/mockData";
import { getMutualFreeTimes } from "@/lib/matching/getFreeTimes";

export default function Test() {
  function handleTest() {
    const freeSlots = getMutualFreeTimes(sampleCalendar1, sampleCalendar2);
    console.log("Common Availability Found:", freeSlots);
  }

  return <button onClick={handleTest}>test free times</button>;
}
