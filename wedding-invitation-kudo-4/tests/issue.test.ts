import { describe, expect, it } from "vitest";
import { figureLabel, folio, issueLabel, rubric, RUBRICS, weekdayMonthYear } from "@/lib/issue";

describe("issue helpers", () => {
  it("pads page and figure numbers", () => {
    expect(folio(4)).toBe("04");
    expect(folio(56)).toBe("56");
    expect(figureLabel(3)).toBe("Gbr. 03");
  });

  it("labels the issue by month in the event's time zone", () => {
    expect(issueLabel("2027-06-12T08:00:00+07:00", "Asia/Jakarta")).toBe("Edisi Juni 2027");
    // 31 Mei 23:00 UTC is already June in Jakarta.
    expect(issueLabel("2027-05-31T23:00:00Z", "Asia/Jakarta")).toBe("Edisi Juni 2027");
  });

  it("formats weekday with month and year", () => {
    expect(weekdayMonthYear("2027-06-12T08:00:00+07:00", "Asia/Jakarta")).toBe("Sabtu · Juni 2027");
  });

  it("looks up rubrics and keeps pages ascending", () => {
    expect(rubric("agenda").label).toBe("Agenda");
    const pages = RUBRICS.map((r) => r.page);
    expect([...pages].sort((a, b) => a - b)).toEqual(pages);
    expect(new Set(RUBRICS.map((r) => r.id)).size).toBe(RUBRICS.length);
  });
});
