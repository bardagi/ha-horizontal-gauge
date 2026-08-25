import type {
  HassState,
  HomeAssistant,
  NormalizedHorizontalGaugeCardConfig,
} from "./types";

export interface DisplayParts {
  value: string;
  unit: string;
}

export function parseNumericState(state: HassState | undefined): number | null {
  if (!state || typeof state.state !== "string") return null;
  const raw = state.state.trim();
  if (raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

const fallbackFormatters = new Map<string, Intl.NumberFormat>();

function fallbackNumberFormat(hass: HomeAssistant, value: number): string {
  const language = hass.language || "";
  let formatter = fallbackFormatters.get(language);
  if (!formatter) {
    formatter = new Intl.NumberFormat(language || undefined, {
      maximumFractionDigits: 3,
    });
    fallbackFormatters.set(language, formatter);
  }
  return formatter.format(value);
}

export function resolveDisplayParts(
  hass: HomeAssistant,
  state: HassState | undefined,
  value: number | null,
  config: NormalizedHorizontalGaugeCardConfig,
): DisplayParts {
  const attributeUnit =
    typeof state?.attributes.unit_of_measurement === "string"
      ? state.attributes.unit_of_measurement
      : undefined;

  if (value === null || !state) {
    return {
      value: "—",
      unit: config.unit !== undefined ? config.unit : (attributeUnit ?? ""),
    };
  }

  const parts = hass.formatEntityStateToParts?.(state) ?? [];
  const formattedValue = parts
    .filter((part) => part.type !== "unit")
    .map((part) => part.value)
    .join("")
    .trim();
  const formattedUnit = parts
    .filter((part) => part.type === "unit")
    .map((part) => part.value)
    .join("")
    .trim();

  return {
    value: formattedValue || fallbackNumberFormat(hass, value),
    unit:
      config.unit !== undefined
        ? config.unit
        : formattedUnit || attributeUnit || "",
  };
}

export function resolveName(
  hass: HomeAssistant,
  state: HassState | undefined,
  config: NormalizedHorizontalGaugeCardConfig,
): string {
  if (config.name !== undefined) return config.name;
  if (!state) return config.entity;
  return (
    hass.formatEntityName?.(state, undefined) ??
    (typeof state.attributes.friendly_name === "string"
      ? state.attributes.friendly_name
      : config.entity)
  );
}

export function resolveStateProblem(
  hass: HomeAssistant,
  state: HassState | undefined,
  value: number | null,
  entity: string,
): string | null {
  if (!state) {
    return (
      hass.localize?.(
        "ui.panel.lovelace.warning.entity_not_found",
        "entity",
        entity,
      ) || `Entity not found: ${entity}`
    );
  }
  if (value !== null) return null;

  const formattedState = hass.formatEntityState?.(state) || state.state;
  if (state.state === "unknown" || state.state === "unavailable") {
    return formattedState;
  }
  return `Invalid numeric state: ${formattedState}`;
}
