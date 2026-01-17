"use server"

import { google } from 'googleapis';



export const getCalendarData = async (googleToken: string) => {
    console.log("TOKEN: ", googleToken);

  // 1. Initialize the Auth client with the token
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: googleToken });

  // 2. Initialize the Calendar client
  const calendar = google.calendar({ version: 'v3', auth });

  try {
    // 3. Fetch the list of events
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(), // Only fetch future events
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log(res.data.items);

    return res.data.items;
  } catch (err) {
    console.error('The API returned an error: ' + err);
  }
};