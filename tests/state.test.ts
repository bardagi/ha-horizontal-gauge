import { describe, expect, it, vi } from "vitest";

import { normalizeConfig } from "../src/config";
import {
  parseNumericState,
  resolveDisplayParts,
  resolveName,
} from "../src/state";
import type { HomeAssistant, MoistureGaugeCardConfig } from "../src/types";

function state(value: string, attributes: Record<string, unknown> = {}) {
  return {
    entity_id: "sensor.plant_moisture",
    state: value,
    attributes,
    context: { id: "context", parent_id: null, user_id: null },
    last_changed: "2026-08-24T00:00:00Z",
    last_reported: "2026-08-24T00:00:00Z",
    last_updated: "2026-08-24T00:00:00Z",
  };
}

function hassStub() {
  return {
    language: "en",
    formatEntityStateToParts: vi.fn(() => [
      { type: "value", value: "42.5" },
      { type: "literal", value: " " },
      { type: "unit", value: "%" },
    ]),
    formatEntityName: vi.fn(
      (entity: ReturnType<typeof state>) => entity.attributes.friendly_name,
    ),
  } as unknown as HomeAssistant;
}

const baseConfig: MoistureGaugeCardConfig = {
  type: "custom:moisture-gauge-card",
  entity: "sensor.plant_moisture",
};

describe("sensor state handling", () => {
  it.each(["", " ", "unknown", "unavailable", "42bad", "NaN", "Infinity"])(
    "rejects non-numeric state %j",
    (value) => {
      expect(parseNumericState(state(value))).toBeNull();
    },
  );

  it("accepts finite numeric states only", () => {
    expect(parseNumericState(state("42.5"))).toBe(42.5);
    expect(parseNumericState(state("0"))).toBe(0);
    expect(parseNumericState(undefined)).toBeNull();
  });

  it("uses Home Assistant formatting and entity metadata", () => {
    const hass = hassStub();
    const entity = state("42.5", {
      unit_of_measurement: "%",
      friendly_name: "Fern",
    });
    const config = normalizeConfig(baseConfig);

    expect(resolveDisplayParts(hass, entity, 42.5, config)).toEqual({
      value: "42.5",
      unit: "%",
    });
    expect(resolveName(hass, entity, config)).toBe("Fern");
  });

  it("uses explicit unit precedence, including an empty unit", () => {
    const hass = hassStub();
    const entity = state("42.5", { unit_of_measurement: "%" });

    expect(
      resolveDisplayParts(
        hass,
        entity,
        42.5,
        normalizeConfig({ ...baseConfig, unit: "points" }),
      ).unit,
    ).toBe("points");
    expect(
      resolveDisplayParts(
        hass,
        entity,
        42.5,
        normalizeConfig({ ...baseConfig, unit: "" }),
      ).unit,
    ).toBe("");
  });

  it("falls back to percent without a configured or entity unit", () => {
    const hass = hassStub();
    hass.formatEntityStateToParts = vi.fn(() => [
      { type: "value" as const, value: "42.5" },
    ]);
    expect(
      resolveDisplayParts(
        hass,
        state("42.5"),
        42.5,
        normalizeConfig(baseConfig),
      ).unit,
    ).toBe("%");
  });
});
