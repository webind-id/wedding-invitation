import { describe, expect, it } from "vitest";
import { dateInWords, monthGrid, replyDeadline, terbilang, timeInWords } from "@/lib/words";

const TZ = "Asia/Jakarta";

describe("terbilang", () => {
  it.each([
    [0, "nol"],
    [1, "satu"],
    [10, "sepuluh"],
    [11, "sebelas"],
    [12, "dua belas"],
    [19, "sembilan belas"],
    [20, "dua puluh"],
    [31, "tiga puluh satu"],
    [100, "seratus"],
    [115, "seratus lima belas"],
    [250, "dua ratus lima puluh"],
    [1000, "seribu"],
    [1999, "seribu sembilan ratus sembilan puluh sembilan"],
    [2027, "dua ribu dua puluh tujuh"],
    [12345, "dua belas ribu tiga ratus empat puluh lima"],
  ])("%i → %s", (n, words) => {
    expect(terbilang(n)).toBe(words);
  });
});

describe("dates & times in words", () => {
  it("writes the full date", () => {
    expect(dateInWords("2027-06-12T08:00:00+07:00", TZ)).toBe("Sabtu, dua belas Juni, dua ribu dua puluh tujuh");
  });

  it("writes times with the period of day", () => {
    expect(timeInWords("2027-06-12T08:00:00+07:00", TZ)).toBe("pukul delapan pagi");
    expect(timeInWords("2027-06-12T11:30:00+07:00", TZ)).toBe("pukul sebelas tiga puluh siang");
    expect(timeInWords("2027-06-12T16:15:00+07:00", TZ)).toBe("pukul empat lewat lima belas menit sore");
    expect(timeInWords("2027-06-12T19:00:00+07:00", TZ)).toBe("pukul tujuh malam");
    expect(timeInWords("2027-06-12T12:00:00+07:00", TZ)).toBe("pukul dua belas siang");
  });
});

describe("monthGrid", () => {
  it("builds a Monday-first grid for June 2027", () => {
    const grid = monthGrid("2027-06-12T08:00:00+07:00", TZ);
    expect(grid.monthLabel).toBe("Juni 2027");
    expect(grid.day).toBe(12);
    // 1 Juni 2027 jatuh pada Selasa → satu sel kosong di awal.
    expect(grid.weeks[0]).toEqual([null, 1, 2, 3, 4, 5, 6]);
    expect(grid.weeks.flat().filter(Boolean)).toHaveLength(30);
    expect(grid.weeks.every((w) => w.length === 7)).toBe(true);
  });

  it("uses the event's time zone for the month", () => {
    // 31 Mei 2027 20:00 UTC = 1 Juni 2027 di WIB.
    expect(monthGrid("2027-05-31T20:00:00Z", TZ).monthLabel).toBe("Juni 2027");
  });
});

describe("replyDeadline", () => {
  it("is two weeks before the event by default", () => {
    expect(replyDeadline("2027-06-12T08:00:00+07:00", TZ)).toBe("29 Mei 2027");
    expect(replyDeadline("2027-06-12T08:00:00+07:00", TZ, 7)).toBe("5 Juni 2027");
  });
});
