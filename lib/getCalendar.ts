"use server";

import { google } from "googleapis";
import { addFreeTimesToDB } from "./freeTimes/addFreeTimesToDB";

export const getCalendarData = async (googleToken: string) => {
  console.log("TOKEN: ", googleToken);

  // 1. Initialize the Auth client with the token
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: googleToken });

  // 2. Initialize the Calendar client
  const calendar = google.calendar({ version: "v3", auth });

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7); // get one week later
  try {
    // 3. Fetch the list of events
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: startDate.toISOString(), // Only fetch future events
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    // TODO change hardcoded
    addFreeTimesToDB("6jMh0wezCRPW13NrKdnlum0cY9d2", res.data);

    console.log(res.data.items);

    return res.data.items;
  } catch (err) {
    console.error("The API returned an error: " + err);
  }
};
