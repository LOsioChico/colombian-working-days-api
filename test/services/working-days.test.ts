import { describe, it, expect } from "vitest";
import { calculateWorkingDays } from "../../src/services/working-days.service";
import { ColombianHoliday } from "../../src/types";

describe("Working Days Service - Technical Assessment Examples", () => {
  describe("Example 1: Friday 5 PM + 1 hour", () => {
    it("should move to Monday 9 AM when adding 1 hour to Friday 5 PM", async () => {
      const result = await calculateWorkingDays(
        {
          date: "2025-01-03T22:00:00.000Z", // Friday 5 PM Colombia (UTC-5)
          hours: 1,
        },
        [],
      );

      expect(result).toBe("2025-01-06T14:00:00.000Z"); // Monday 9 AM Colombia in UTC
    });
  });

  describe("Example 2: Saturday 2 PM + 1 hour", () => {
    it("should move to Monday 9 AM when adding 1 hour to Saturday 2 PM", async () => {
      const result = await calculateWorkingDays(
        {
          date: "2025-01-04T19:00:00.000Z", // Saturday 2 PM Colombia (UTC-5)
          hours: 1,
        },
        [],
      );

      expect(result).toBe("2025-01-06T14:00:00.000Z"); // Monday 9 AM Colombia in UTC
    });
  });

  describe("Example 3: Tuesday 3 PM + 1 day + 4 hours", () => {
    it("should add days first, then hours: Tuesday 3 PM → Thursday 10 AM", async () => {
      const result = await calculateWorkingDays(
        {
          date: "2025-01-07T20:00:00.000Z", // Tuesday 3 PM Colombia (UTC-5)
          days: 1,
          hours: 4,
        },
        [],
      );

      expect(result).toBe("2025-01-09T15:00:00.000Z"); // Thursday 10 AM Colombia in UTC
    });
  });

  describe("Example 4: Sunday 6 PM + 1 day", () => {
    it("should adjust backwards to Friday 5 PM then add 1 day → Monday 5 PM", async () => {
      const result = await calculateWorkingDays(
        {
          date: "2025-01-05T23:00:00.000Z", // Sunday 6 PM Colombia (UTC-5)
          days: 1,
        },
        [],
      );

      expect(result).toBe("2025-01-06T22:00:00.000Z"); // Monday 5 PM Colombia in UTC
    });
  });

  describe("Example 5: Working day 8 AM + 8 hours", () => {
    it("should end at 5 PM same day (8 hours = full work day)", async () => {
      const result = await calculateWorkingDays(
        {
          date: "2025-01-06T13:00:00.000Z", // Monday 8 AM Colombia (UTC-5)
          hours: 8,
        },
        [],
      );

      expect(result).toBe("2025-01-06T22:00:00.000Z"); // Monday 5 PM Colombia in UTC
    });
  });

  describe("Example 6: Working day 8 AM + 1 day", () => {
    it("should move to next working day at 8 AM", async () => {
      const result = await calculateWorkingDays(
        {
          date: "2025-01-06T13:00:00.000Z", // Monday 8 AM Colombia (UTC-5)
          days: 1,
        },
        [],
      );

      expect(result).toBe("2025-01-07T13:00:00.000Z"); // Tuesday 8 AM Colombia in UTC
    });
  });

  describe("Example 7: Working day 12:30 PM + 1 day", () => {
    it("should adjust backwards to 12:00 PM then add 1 day → next day 12:00 PM", async () => {
      const result = await calculateWorkingDays(
        {
          date: "2025-01-06T17:30:00.000Z", // Monday 12:30 PM Colombia (UTC-5)
          days: 1,
        },
        [],
      );

      expect(result).toBe("2025-01-07T17:00:00.000Z"); // Tuesday 12 PM Colombia in UTC
    });
  });

  describe("Example 8: Working day 11:30 AM + 3 hours", () => {
    it("should add 3 hours accounting for lunch break → 3:30 PM same day", async () => {
      const result = await calculateWorkingDays(
        {
          date: "2025-01-06T16:30:00.000Z", // Monday 11:30 AM Colombia (UTC-5)
          hours: 3,
        },
        [],
      );

      expect(result).toBe("2025-01-06T20:30:00.000Z"); // Monday 3:30 PM Colombia in UTC
    });
  });

  describe("Example 9: With Colombian holidays", () => {
    it("should skip holidays when calculating working days", async () => {
      const mockHolidays = ["2025-04-17", "2025-04-18"] as ColombianHoliday[]; // Mock holidays

      const result = await calculateWorkingDays(
        {
          date: "2025-04-10T15:00:00.000Z", // April 10 10:00 AM Colombia (UTC-5)
          days: 5,
          hours: 4,
        },
        mockHolidays,
      );

      expect(result).toBe("2025-04-21T20:00:00.000Z"); // April 21 3:00 PM Colombia in UTC (as per assessment)
    });
  });

  describe("Edge cases", () => {
    it("should handle current time when no date provided", async () => {
      const result = await calculateWorkingDays(
        {
          hours: 1,
        },
        [],
      );

      // Should return a valid ISO string
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should handle only days parameter", async () => {
      const result = await calculateWorkingDays(
        {
          date: "2025-01-06T13:00:00.000Z", // Monday 8 AM Colombia
          days: 2,
        },
        [],
      );

      expect(result).toBe("2025-01-08T13:00:00.000Z"); // Wednesday 8 AM Colombia in UTC
    });

    it("should handle only hours parameter", async () => {
      const result = await calculateWorkingDays(
        {
          date: "2025-01-06T13:00:00.000Z", // Monday 8 AM Colombia
          hours: 4,
        },
        [],
      );

      expect(result).toBe("2025-01-06T18:00:00.000Z"); // Monday 1 PM Colombia in UTC (after lunch)
    });
  });
});
