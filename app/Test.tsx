import { sampleCalendar1, sampleCalendar2 } from "@/assets/mockData";
import { getFreeTimes } from "@/lib/matching/getFreeTimes";

export default function Test() {
  function handleTest() {
    console.log(getFreeTimes());
  }

  return <button onClick={handleTest}>test free times</button>;
}
