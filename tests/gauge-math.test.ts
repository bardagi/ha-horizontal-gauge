import { describe, expect, it } from "vitest";

import {
  GAUGE_ARC_PATH,
  GAUGE_CENTER,
  GAUGE_VIEWBOX_HEIGHT,
  GAUGE_VIEWBOX_WIDTH,
  gaugeAngle,
  getGaugeZone,
  normalizeGaugeValue,
  pointOnGauge,
} from "../src/gauge-math";

describe("gauge geometry", () => {
  it.each([
    [0, 135],
    [0.25, 202.5],
    [0.5, 270],
    [0.75, 337.5],
    [1, 405],
  ])("maps %s progress to a shared %s degree angle", (progress, angle) => {
    expect(gaugeAngle(progress)).toBe(angle);

    const tick = pointOnGauge(progress, 60);
    const radians = (angle * Math.PI) / 180;
    const needleTip = {
      x: GAUGE_CENTER + 60 * Math.cos(radians),
      y: GAUGE_CENTER + 60 * Math.sin(radians),
    };
    expect(tick.x).toBeCloseTo(needleTip.x, 8);
    expect(tick.y).toBeCloseTo(needleTip.y, 8);
  });

  it("keeps the outer ticks inside the viewbox", () => {
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      const point = pointOnGauge(progress, 74);
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(GAUGE_VIEWBOX_WIDTH);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(GAUGE_VIEWBOX_HEIGHT);
    }
  });

  it("builds a 270 degree large-arc path", () => {
    expect(GAUGE_ARC_PATH).toContain("A 70 70 0 1 1");
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
