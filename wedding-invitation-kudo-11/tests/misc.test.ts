import { describe, expect, it } from "vitest";
import { buildIcs, escapeIcsText, googleCalendarLink, mapsEmbedLink, mapsSearchLink, toUtcStamp } from "@/lib/calendar";
import { dateStub, formatClock, formatDotDate, formatLongDate, relativeTime, timeLeftUntil } from "@/lib/datetime";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import type { WeddingEvent } from "@/shared/contract";

const TZ = "Asia/Jakarta";
const event: WeddingEvent = {
  id: "akad",
  name: "Akad Nikah",
  start: "2027-06-12T08:00:00+07:00",
  end: "2027-06-12T10:00:00+07:00",
  venue: "Pendopo",
  address: "Bandung, Jawa Barat",
  mapsUrl: "",
  note: "",
};

describe("calendar", () => {
  it("converts ISO with offset to a UTC stamp", () => {
    expect(toUtcStamp(event.start)).toBe("20270612T010000Z");
  });

  it("builds a Google Calendar link", () => {
    const url = new URL(googleCalendarLink(event, "Cahya & Wahyu"));
    expect(url.searchParams.get("dates")).toBe("20270612T010000Z/20270612T030000Z");
    expect(url.searchParams.get("location")).toBe("Pendopo, Bandung, Jawa Barat");
  });

  it("escapes ICS text and builds one VEVENT per event", () => {
    expect(escapeIcsText("a,b;c\\d\ne")).toBe("a\\,b\\;c\\\\d\\ne");
    const ics = buildIcs([event, { ...event, id: "resepsi" }], "Cahya & Wahyu", new Date(0));
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics).toContain("UID:akad-cahya-wahyu@undangan");
    expect(ics).toContain("LOCATION:Pendopo\\, Bandung\\, Jawa Barat");
  });

  it("prefers a custom maps URL", () => {
    expect(mapsSearchLink({ ...event, mapsUrl: "https://maps.app/x" })).toBe("https://maps.app/x");
    expect(mapsSearchLink(event)).toContain("query=Pendopo%2C%20Bandung");
    expect(mapsEmbedLink(event)).toContain("q=Pendopo%2C%20Bandung");
  });
});

describe("datetime", () => {
  it("formats Indonesian dates", () => {
    expect(formatLongDate(event.start, TZ)).toBe("Sabtu, 12 Juni 2027");
    expect(formatDotDate(event.start, TZ)).toBe("12 · 06 · 2027");
    expect(formatClock(event.start, TZ)).toBe("08.00");
    expect(dateStub(event.start, TZ)).toEqual({ weekday: "Sab", day: "12", month: "Jun" });
  });

  it("computes time left and stops at zero", () => {
    expect(timeLeftUntil(90_061_000, 0)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1, done: false });
    expect(timeLeftUntil(0, 5).done).toBe(true);
  });

  it("produces relative labels", () => {
    const now = Date.parse("2027-01-10T00:00:00Z");
    expect(relativeTime("2027-01-10T00:00:00Z", now)).toBe("baru saja");
    expect(relativeTime("2027-01-09T23:55:00Z", now)).toBe("5 menit lalu");
    expect(relativeTime("2027-01-09T21:00:00Z", now)).toBe("3 jam lalu");
    expect(relativeTime("2027-01-07T00:00:00Z", now)).toBe("3 hari lalu");
    expect(relativeTime("2026-12-01T00:00:00Z", now)).toMatch(/2026/);
  });
});


describe("rate limiter", () => {
  it("blocks after the limit and recovers after the window", () => {
    const limiter = createRateLimiter(2, 1000);
    expect(limiter.check("ip", 0)).toBe(true);
    expect(limiter.check("ip", 10)).toBe(true);
    expect(limiter.check("ip", 20)).toBe(false);
    expect(limiter.check("other", 20)).toBe(true);
    expect(limiter.check("ip", 1_011)).toBe(true);
  });

  it("prefers platform headers, else the rightmost forwarded hop", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "6.6.6.6, 2.2.2.2" }))).toBe("2.2.2.2");
    expect(clientIp(new Headers({ "x-real-ip": "3.3.3.3", "x-forwarded-for": "6.6.6.6" }))).toBe("3.3.3.3");
    expect(clientIp(new Headers({ "x-vercel-forwarded-for": "4.4.4.4" }))).toBe("4.4.4.4");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
