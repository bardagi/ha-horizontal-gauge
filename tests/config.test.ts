import { describe, expect, it } from "vitest";

import {
  DEFAULT_BUFFER,
  DEFAULT_LAMP,
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_OPTIMAL,
  normalizeConfig,
} from "../src/config";
import type { HorizontalGaugeCardConfig } from "../src/types";

const baseConfig: HorizontalGaugeCardConfig = {
  type: "custom:horizontal-gauge-card",
  entity: "sensor.test_sensor",
};

describe("normalizeConfig", () => {
  it("applies defaults and action behavior", () => {
    const config = normalizeConfig(baseConfig);

    expect(config.min).toBe(DEFAULT_MIN);
    expect(config.max).toBe(DEFAULT_MAX);
    expect(config.optimal).toEqual(DEFAULT_OPTIMAL);
    expect(config.buffer).toBe(DEFAULT_BUFFER);
    expect(config.lamp).toEqual(DEFAULT_LAMP);
    expect(config.layout).toBe("simple");
    expect(config.tap_action).toEqual({ action: "more-info" });
    expect(config.hold_action).toEqual({ action: "none" });
    expect(config.double_tap_action).toEqual({ action: "none" });
  });

  it("deep-fills a partial optimal range", () => {
    expect(
      normalizeConfig({ ...baseConfig, optimal: { min: 45 } }).optimal,
    ).toEqual({ min: 45, max: 70 });
    expect(
      normalizeConfig({ ...baseConfig, optimal: { max: 65 } }).optimal,
    ).toEqual({ min: 40, max: 65 });
  });

  it("deep-fills a partial lamp config", () => {
    expect(
      normalizeConfig({ ...baseConfig, lamp: { icon: "mdi:water" } }).lamp,
    ).toEqual({ icon: "mdi:water", label: "", alert_label: "" });
    expect(
      normalizeConfig({ ...baseConfig, lamp: { label: "OK" } }).lamp,
    ).toEqual({ icon: "mdi:circle", label: "OK", alert_label: "" });
  });

  it.each([
    [{ ...baseConfig, entity: "" }, "Specify a sensor entity"],
    [{ ...baseConfig, min: Number.NaN }, "min must be a finite number"],
    [{ ...baseConfig, min: 10, max: 10 }, "min must be less than max"],
    [{ ...baseConfig, min: 20, max: 10 }, "min must be less than max"],
    [
      { ...baseConfig, optimal: { min: 80, max: 20 } },
      "optimal.min must be less than or equal to optimal.max",
    ],
    [
      { ...baseConfig, buffer: -1 },
      "buffer must be greater than or equal to zero",
    ],
    [{ ...baseConfig, lamp: "bright" }, "lamp must be an object"],
    [{ ...baseConfig, lamp: { icon: 5 } }, "lamp.icon must be a string"],
  ])("rejects invalid configuration", (config, message) => {
    expect(() => normalizeConfig(config as HorizontalGaugeCardConfig)).toThrow(
      message,
    );
  });

  it("preserves an explicitly empty unit", () => {
    expect(normalizeConfig({ ...baseConfig, unit: "" }).unit).toBe("");
  });

  it.each(["compact", "simple", "volvo"] as const)(
    "accepts the %s layout",
    (layout) => {
      expect(normalizeConfig({ ...baseConfig, layout }).layout).toBe(layout);
    },
  );

  it("rejects an unsupported layout", () => {
    expect(() =>
      normalizeConfig({ ...baseConfig, layout: "dashboard" } as never),
    ).toThrow("layout must be compact, simple, or volvo");
  });
});
