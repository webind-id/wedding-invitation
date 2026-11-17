import { describe, expect, it } from "vitest";
import { eventTimeLabel, panelNameSize, panelNameTracking } from "@/lib/labels";

const content = { timeZone: "Asia/Jakarta" as const };

describe("eventTimeLabel", () => {
  it("shows start and end with the zone", () => {
    const event = { start: "2027-08-08T10:00:00+07:00", end: "2027-08-08T12:00:00+07:00", untilFinished: false };
    expect(eventTimeLabel(event, content, "WIB")).toBe("10.00 – 12.00 WIB");
  });

  it("shows 's.d. selesai' when the event runs until finished", () => {
    const event = { start: "2027-08-08T18:30:00+07:00", end: "2027-08-08T21:00:00+07:00", untilFinished: true };
    expect(eventTimeLabel(event, content, "WIB")).toBe("18.30 WIB s.d. selesai");
  });
});

describe("panelNameSize", () => {
  it("shrinks long names so they stay inside the moon gate", () => {
    expect(panelNameSize("Ryan")).toBe(28);
    expect(panelNameSize("Kurniawan")).toBe(20);
    expect(panelNameSize("Christabelle")).toBe(17);
  });

  it("tightens letter spacing for smaller sizes", () => {
    expect(panelNameTracking(28)).toBe(6);
    expect(panelNameTracking(17)).toBe(3);
  });
});
