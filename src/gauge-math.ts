import type { GaugePoint, GaugeZone, OptimalRange } from "./types";

export const GAUGE_VIEWBOX_WIDTH = 640;
export const GAUGE_VIEWBOX_HEIGHT = 104;
export const GAUGE_TRACK_START_X = 48;
export const GAUGE_TRACK_END_X = 592;
export const GAUGE_TRACK_Y = 76;
export const GAUGE_TRACK_LENGTH = GAUGE_TRACK_END_X - GAUGE_TRACK_START_X;
export const GAUGE_TRACK_PATH = `M ${GAUGE_TRACK_START_X} ${GAUGE_TRACK_Y} H ${GAUGE_TRACK_END_X}`;

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

export function pointOnGauge(progress: number, y = GAUGE_TRACK_Y): GaugePoint {
  return {
    x: GAUGE_TRACK_START_X + clamp(progress, 0, 1) * GAUGE_TRACK_LENGTH,
    y,
  };
}

export function gaugePointerPath(progress: number): string {
  const { x } = pointOnGauge(progress);
  return `M ${x - 8} 53 H ${x + 8} L ${x} 67 Z`;
}

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
