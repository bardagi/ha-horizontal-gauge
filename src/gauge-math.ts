import type { GaugePoint, GaugeZone, OptimalRange } from "./types";

export const GAUGE_CENTER = 100;
export const GAUGE_RADIUS = 70;
export const GAUGE_START_ANGLE = 135;
export const GAUGE_SWEEP_ANGLE = 270;
export const GAUGE_VIEWBOX_WIDTH = 200;
export const GAUGE_VIEWBOX_HEIGHT = 160;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizeGaugeValue(
  value: number,
  min: number,
  max: number,
): number {
  if (![value, min, max].every(Number.isFinite)) {
    throw new Error("Gauge values must be finite");
  }
  if (min >= max) {
    throw new Error("Gauge minimum must be less than maximum");
  }
  return clamp((value - min) / (max - min), 0, 1);
}

export function gaugeAngle(progress: number): number {
  return GAUGE_START_ANGLE + clamp(progress, 0, 1) * GAUGE_SWEEP_ANGLE;
}

export function pointOnGauge(
  progress: number,
  radius = GAUGE_RADIUS,
): GaugePoint {
  const radians = (gaugeAngle(progress) * Math.PI) / 180;
  return {
    x: GAUGE_CENTER + radius * Math.cos(radians),
    y: GAUGE_CENTER + radius * Math.sin(radians),
  };
}

function svgNumber(value: number): string {
  return Number(value.toFixed(4)).toString();
}

const arcStart = pointOnGauge(0);
const arcEnd = pointOnGauge(1);

export const GAUGE_ARC_PATH = `M ${svgNumber(arcStart.x)} ${svgNumber(
  arcStart.y,
)} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 1 1 ${svgNumber(
  arcEnd.x,
)} ${svgNumber(arcEnd.y)}`;

export function getGaugeZone(
  value: number,
  optimal: OptimalRange,
  buffer: number,
): GaugeZone {
  if (value < optimal.min - buffer || value > optimal.max + buffer) {
    return "critical";
  }
  if (value < optimal.min || value > optimal.max) {
    return "warning";
  }
  return "optimal";
}
