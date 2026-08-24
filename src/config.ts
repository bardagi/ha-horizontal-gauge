import type {
  GaugeLayout,
  MoistureGaugeCardConfig,
  NormalizedMoistureGaugeCardConfig,
  OptimalRange,
} from "./types";

export const DEFAULT_MIN = 0;
export const DEFAULT_MAX = 100;
export const DEFAULT_OPTIMAL: OptimalRange = { min: 40, max: 70 };
export const DEFAULT_BUFFER = 5;
export const DEFAULT_LAYOUT: GaugeLayout = "volvo";

const GAUGE_LAYOUTS = new Set<GaugeLayout>(["compact", "simple", "volvo"]);

function finiteNumber(name: string, value: unknown, fallback: number): number {
  const resolved = value ?? fallback;
  if (typeof resolved !== "number" || !Number.isFinite(resolved)) {
    throw new Error(`${name} must be a finite number`);
  }
  return resolved;
}

export function normalizeConfig(
  config: MoistureGaugeCardConfig,
): NormalizedMoistureGaugeCardConfig {
  if (!config || typeof config !== "object") {
    throw new Error("Card configuration is required");
  }
  if (typeof config.entity !== "string" || config.entity.trim() === "") {
    throw new Error("Specify a sensor entity");
  }
  if (config.name !== undefined && typeof config.name !== "string") {
    throw new Error("name must be a string");
  }
  if (config.unit !== undefined && typeof config.unit !== "string") {
    throw new Error("unit must be a string");
  }
  if (
    config.layout !== undefined &&
    !GAUGE_LAYOUTS.has(config.layout as GaugeLayout)
  ) {
    throw new Error("layout must be compact, simple, or volvo");
  }
  if (
    config.optimal !== undefined &&
    (config.optimal === null || typeof config.optimal !== "object")
  ) {
    throw new Error("optimal must contain min and max values");
  }

  const min = finiteNumber("min", config.min, DEFAULT_MIN);
  const max = finiteNumber("max", config.max, DEFAULT_MAX);
  const optimalMin = finiteNumber(
    "optimal.min",
    config.optimal?.min,
    DEFAULT_OPTIMAL.min,
  );
  const optimalMax = finiteNumber(
    "optimal.max",
    config.optimal?.max,
    DEFAULT_OPTIMAL.max,
  );
  const buffer = finiteNumber("buffer", config.buffer, DEFAULT_BUFFER);

  if (min >= max) {
    throw new Error("min must be less than max");
  }
  if (optimalMin > optimalMax) {
    throw new Error("optimal.min must be less than or equal to optimal.max");
  }
  if (buffer < 0) {
    throw new Error("buffer must be greater than or equal to zero");
  }

  return {
    ...config,
    entity: config.entity.trim(),
    layout: config.layout ?? DEFAULT_LAYOUT,
    min,
    max,
    optimal: { min: optimalMin, max: optimalMax },
    buffer,
    tap_action: config.tap_action ?? { action: "more-info" },
    hold_action: config.hold_action ?? { action: "none" },
    double_tap_action: config.double_tap_action ?? { action: "none" },
  };
}
