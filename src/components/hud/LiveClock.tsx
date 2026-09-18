"use client";

import { useEffect, useState } from "react";

/**
 * HUD clock — always renders the current time in IST (Asia/Kolkata
 * tz) and labels the zone as HYDERABAD, regardless of the viewer's
 * own locale. This is a personal portfolio; the location displayed
 * is the site owner's location, not the visitor's.
 */
export function LiveClock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    });

    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/80">
      {time} <span className="text-fg/40">/ HYDERABAD</span>
    </span>
  );
}
