"use client"

import { useToken } from "@/context/TokenContext"
import { getCalendarData } from "@/lib/getCalendar";
import { useEffect, useState } from "react";


export default function CalendarPage() {
    const { token } = useToken();

    console.log("TOKEN: ", token);
    const [calendarData, setCalendarData] = useState<Object[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data: Object[] = await getCalendarData(token || "");

            setCalendarData(data);
        }
        fetchData()
    }, []);

    console.log(calendarData)

    return (
        <div>
            {calendarData.map((event) => {
                //@ts-ignore
                return <div id={event.id}>
                    {/*@ts-ignore*/}
                    {event.summary}
                </div>
            })}
        </div>
    )
}