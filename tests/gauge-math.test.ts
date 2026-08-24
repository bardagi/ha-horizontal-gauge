import { describe, expect, it } from "vitest";

import {
  GAUGE_TRACK_END_X,
  GAUGE_TRACK_PATH,
  GAUGE_TRACK_START_X,
  GAUGE_TRACK_Y,
  GAUGE_VIEWBOX_HEIGHT,
  GAUGE_VIEWBOX_WIDTH,
  gaugePointerPath,
  getGaugeZone,
  normalizeGaugeValue,
  pointOnGauge,
} from "../src/gauge-math";

describe("gauge geometry", () => {
  it.each([
    [0, 48],
    [0.25, 184],
    [0.5, 320],
    [0.75, 456],
    [1, 592],
  ])(
    "maps %s progress to the shared horizontal x position %s",
    (progress, x) => {
      const position = pointOnGauge(progress);

      expect(position).toEqual({ x, y: GAUGE_TRACK_Y });
      expect(gaugePointerPath(progress)).toContain(`L ${x} 67 Z`);
    },
  );

  it("keeps ticks and pointers inside the viewbox", () => {
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      const point = pointOnGauge(progress);
      expect(point.x - 8).toBeGreaterThanOrEqual(0);
      expect(point.x + 8).toBeLessThanOrEqual(GAUGE_VIEWBOX_WIDTH);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(GAUGE_VIEWBOX_HEIGHT);
    }
  });

  it("builds one left-to-right horizontal path", () => {
    expect(GAUGE_TRACK_PATH).toBe(
      `M ${GAUGE_TRACK_START_X} ${GAUGE_TRACK_Y} H ${GAUGE_TRACK_END_X}`,
    );
    expect(GAUGE_TRACK_PATH).not.toContain("A ");
  });

  it("clamps visual progress without changing input values", () => {
    expect(normalizeGaugeValue(-10, 0, 100)).toBe(0);
    expect(normalizeGaugeValue(50, 0, 100)).toBe(0.5);
    expect(normalizeGaugeValue(110, 0, 100)).toBe(1);
    expect(normalizeGaugeValue(40, 20, 80)).toBeCloseTo(1 / 3);
  });

  it("rejects invalid gauge ranges", () => {
    expect(() => normalizeGaugeValue(5, 10, 10)).toThrow();
    expect(() => normalizeGaugeValue(5, 20, 10)).toThrow();
    expect(() =>
      normalizeGaugeValue(Number.POSITIVE_INFINITY, 0, 100),
    ).toThrow();
  });
});

describe("gauge zones", () => {
  const optimal = { min: 40, max: 70 };

  it.each([
    [34.99, "critical"],
    [35, "warning"],
    [39.99, "warning"],
    [40, "optimal"],
    [70, "optimal"],
    [70.01, "warning"],
    [75, "warning"],
    [75.01, "critical"],
  ] as const)("classifies %s as %s", (value, zone) => {
    expect(getGaugeZone(value, optimal, 5)).toBe(zone);
  });

  it("uses raw sensor units for non-default gauge ranges", () => {
    expect(getGaugeZone(40, { min: 40, max: 60 }, 5)).toBe("optimal");
    expect(normalizeGaugeValue(40, 20, 80)).toBeCloseTo(1 / 3);
  });
});
