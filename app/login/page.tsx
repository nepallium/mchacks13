"use client";



import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { useState } from "react";
import { getCalendarData } from "../../lib/getCalendar"
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToken } from "../../context/TokenContext";

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useToken();

  const [loading, setLoading] = useState(false);
  // const [userToken, setUserToken] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    // 2. Add the Calendar Scopes
    // Use 'calendar.readonly' for viewing or 'calendar' for full edit access
    provider.addScope("https://www.googleapis.com/auth/calendar.events");
    provider.addScope("https://www.googleapis.com/auth/calendar.readonly");

    try {
      const result = await signInWithPopup(auth, provider);

      // 3. Extract the Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleToken = credential?.accessToken;

      if (googleToken) {
        console.log("Access Token for Google Calendar:", googleToken);
        setToken(googleToken);
        router.push("/calendar");
        // Tip: Store this token in a secure cookie or state to use for API calls
        alert("Logged in! Check console for your Calendar Access Token.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Welcome to Calendar Sync</h1>
      <p>Please log in to grant access to your Google Calendar.</p>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? "Connecting..." : "Login with Google"}
      </button>

      <button onClick={async () => await getCalendarData("")}>
        click me
      </button>
    </div>
  );
}