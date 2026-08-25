import type {
  ActionConfig,
  HomeAssistant as BaseHomeAssistant,
  LovelaceCardConfig,
} from "custom-card-helpers";

export type HassState = BaseHomeAssistant["states"][string];

export interface ValuePart {
  type: "value" | "literal" | "unit";
  value: string;
}

export interface HomeAssistant extends BaseHomeAssistant {
  entities: Record<string, unknown>;
  formatEntityState(state: HassState, stateValue?: string): string;
  formatEntityStateToParts(state: HassState, stateValue?: string): ValuePart[];
  formatEntityName(state: HassState, name?: string): string;
}

export interface OptimalRange {
  min: number;
  max: number;
}

export type GaugeLayout = "compact" | "simple" | "volvo";

export interface LampConfig {
  icon: string;
  label: string;
  alert_label: string;
}

export interface HorizontalGaugeCardConfig extends LovelaceCardConfig {
  type: "custom:horizontal-gauge-card";
  entity: string;
  layout?: GaugeLayout;
  name?: string;
  unit?: string;
  min?: number;
  max?: number;
  optimal?: Partial<OptimalRange>;
  buffer?: number;
  lamp?: Partial<LampConfig>;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface NormalizedHorizontalGaugeCardConfig extends HorizontalGaugeCardConfig {
  layout: GaugeLayout;
  min: number;
  max: number;
  optimal: OptimalRange;
  buffer: number;
  lamp: LampConfig;
  tap_action: ActionConfig;
  hold_action: ActionConfig;
  double_tap_action: ActionConfig;
}

export type GaugeZone = "critical" | "warning" | "optimal";

export interface GaugePoint {
  x: number;
  y: number;
}
