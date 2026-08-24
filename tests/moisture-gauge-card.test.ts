import { afterEach, describe, expect, it, vi } from "vitest";

import {
  MoistureGaugeCard,
  MoistureGaugeCardEditor,
} from "../src/moisture-gauge-card";
import type { HomeAssistant } from "../src/types";

function entityState(value: string, attributes: Record<string, unknown> = {}) {
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

function hassStub(value = "50"): HomeAssistant {
  const state = entityState(value, {
    device_class: "moisture",
    friendly_name: "Kitchen Fern",
    unit_of_measurement: "%",
  });
  return {
    states: { "sensor.plant_moisture": state },
    entities: {},
    language: "en",
    formatEntityStateToParts: vi.fn((stateObject) => [
      { type: "value", value: stateObject.state },
      { type: "literal", value: " " },
      { type: "unit", value: "%" },
    ]),
    formatEntityState: vi.fn((stateObject) =>
      stateObject.state === "unavailable" ? "Unavailable" : stateObject.state,
    ),
    formatEntityName: vi.fn(
      (stateObject) => stateObject.attributes.friendly_name as string,
    ),
    localize: vi.fn(() => "Entity not found"),
    callService: vi.fn(),
  } as unknown as HomeAssistant;
}

async function renderCard(value = "50") {
  const card = new MoistureGaugeCard();
  card.setConfig({
    type: "custom:moisture-gauge-card",
    entity: "sensor.plant_moisture",
  });
  card.hass = hassStub(value);
  document.body.append(card);
  await card.updateComplete;
  return card;
}

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("MoistureGaugeCard", () => {
  it("renders a standard, accessible Home Assistant card", async () => {
    const card = await renderCard("50");
    const haCard = card.shadowRoot?.querySelector("ha-card");

    expect(haCard).not.toBeNull();
    expect(haCard?.getAttribute("role")).toBe("button");
    expect(haCard?.getAttribute("tabindex")).toBe("0");
    expect(haCard?.getAttribute("aria-label")).toBe("Kitchen Fern: 50 %");
    expect(
      card.shadowRoot?.querySelector(".gauge-progress.optimal"),
    ).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".state-problem")).toBeNull();
  });

  it("renders unavailable states neutrally instead of as zero", async () => {
    const card = await renderCard("unavailable");
    const value = card.shadowRoot?.querySelector(".gauge-value");
    const progress = card.shadowRoot?.querySelector(
      ".gauge-progress.unavailable",
    );

    expect(value?.textContent?.trim()).toBe("—");
    expect(progress?.getAttribute("style")).toContain("opacity: 0");
    expect(
      card.shadowRoot?.querySelector(".gauge-pointer.unavailable"),
    ).not.toBeNull();
    expect(
      card.shadowRoot?.querySelector(".state-problem")?.textContent,
    ).toContain("Unavailable");
  });

  it("renders a missing entity as a neutral error", async () => {
    const card = new MoistureGaugeCard();
    const hass = hassStub();
    hass.states = {};
    card.setConfig({
      type: "custom:moisture-gauge-card",
      entity: "sensor.missing_moisture",
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;

    expect(
      card.shadowRoot?.querySelector(".gauge-value")?.textContent?.trim(),
    ).toBe("—");
    expect(
      card.shadowRoot?.querySelector(".state-problem")?.textContent,
    ).toContain("Entity not found");
  });

  it("displays an out-of-range value while clamping visual progress", async () => {
    const card = await renderCard("150");
    const progress = card.shadowRoot?.querySelector(".gauge-progress");

    expect(
      card.shadowRoot?.querySelector(".gauge-value")?.textContent?.trim(),
    ).toBe("150");
    expect(progress?.getAttribute("style")).toContain(
      "stroke-dasharray: 100 100",
    );
  });

  it("suppresses the unit when configured with an empty string", async () => {
    const card = new MoistureGaugeCard();
    card.setConfig({
      type: "custom:moisture-gauge-card",
      entity: "sensor.plant_moisture",
      unit: "",
    });
    card.hass = hassStub("50");
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".gauge-unit")).toBeNull();
  });

  it("exposes the visual editor schema and layout sizing", () => {
    const form = MoistureGaugeCard.getConfigForm();
    const optimal = form.schema.find((entry) => entry.name === "optimal");

    expect(optimal).toMatchObject({
      type: "expandable",
      name: "optimal",
    });
    expect(new MoistureGaugeCard().getCardSize()).toBe(3);
    expect(new MoistureGaugeCard().getGridOptions()).toEqual({
      rows: 3,
      columns: 6,
      min_rows: 3,
      min_columns: 3,
    });
  });

  it("debounces visual editor changes so multi-digit maximums stay editable", async () => {
    vi.useFakeTimers();
    const editor = MoistureGaugeCard.getConfigElement();
    const configChanged = vi.fn();
    const baseConfig = {
      type: "custom:moisture-gauge-card" as const,
      entity: "sensor.plant_moisture",
      min: 10,
      max: 100,
    };
    editor.hass = hassStub();
    editor.setConfig(baseConfig);
    editor.addEventListener("config-changed", configChanged);
    document.body.append(editor);
    await editor.updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form");
    form?.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { ...baseConfig, max: 2 } },
      }),
    );
    vi.advanceTimersByTime(200);
    form?.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { ...baseConfig, max: 20 } },
      }),
    );

    expect(editor).toBeInstanceOf(MoistureGaugeCardEditor);
    expect(configChanged).not.toHaveBeenCalled();
    vi.advanceTimersByTime(299);
    expect(configChanged).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(configChanged).toHaveBeenCalledOnce();
    expect(configChanged.mock.calls[0]?.[0]).toMatchObject({
      detail: { config: { min: 10, max: 20 } },
    });
  });

  it("uses Home Assistant theme variables and reduced-motion styling", () => {
    const styles = String(MoistureGaugeCard.styles);

    expect(styles).toContain("var(--success-color");
    expect(styles).toContain("var(--warning-color");
    expect(styles).toContain("var(--error-color");
    expect(styles).toContain("var(--moisture-gauge-face-color");
    expect(styles).toContain("var(--moisture-gauge-bezel-color");
    expect(styles).toContain("prefers-reduced-motion");
  });

  it("renders a wide horizontal scale with aligned ticks and marker", async () => {
    const card = await renderCard("50");
    const svg = card.shadowRoot?.querySelector("svg");
    const indicator = card.shadowRoot?.querySelector(".gauge-indicator");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 640 104");
    expect(card.shadowRoot?.querySelectorAll(".scale-number")).toHaveLength(5);
    expect(card.shadowRoot?.querySelector(".gauge-tick")?.namespaceURI).toBe(
      "http://www.w3.org/2000/svg",
    );
    expect(indicator?.getAttribute("x1")).toBe("320");
    expect(indicator?.getAttribute("x2")).toBe("320");
    expect(
      card.shadowRoot?.querySelector(".gauge-pointer")?.getAttribute("d"),
    ).toContain("L 320 67 Z");
  });

  it("suggests itself only for moisture sensors", () => {
    const metadata = window.customCards?.find(
      (entry) => entry.type === "moisture-gauge-card",
    );
    const hass = hassStub();

    expect(
      metadata?.getEntitySuggestion?.(hass, "sensor.plant_moisture"),
    ).toEqual({
      config: {
        type: "custom:moisture-gauge-card",
        entity: "sensor.plant_moisture",
      },
    });
    expect(metadata?.getEntitySuggestion?.(hass, "light.kitchen")).toBeNull();
  });

  it("runs the configured tap action from the keyboard", async () => {
    const card = new MoistureGaugeCard();
    const hass = hassStub("50");
    const actionHandler = vi.fn();
    card.setConfig({
      type: "custom:moisture-gauge-card",
      entity: "sensor.plant_moisture",
      tap_action: { action: "toggle" },
    });
    card.hass = hass;
    card.addEventListener("hass-action", actionHandler);
    document.body.append(card);
    await card.updateComplete;

    card.shadowRoot?.querySelector("ha-card")?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    expect(actionHandler).toHaveBeenCalledOnce();
    expect(actionHandler.mock.calls[0]?.[0]).toMatchObject({
      detail: {
        action: "tap",
        config: {
          entity: "sensor.plant_moisture",
          tap_action: { action: "toggle" },
        },
      },
    });
  });

  it("distinguishes double tap from a single tap", async () => {
    vi.useFakeTimers();
    const card = new MoistureGaugeCard();
    const actionHandler = vi.fn();
    card.setConfig({
      type: "custom:moisture-gauge-card",
      entity: "sensor.plant_moisture",
      double_tap_action: { action: "more-info" },
    });
    card.hass = hassStub();
    card.addEventListener("hass-action", actionHandler);
    document.body.append(card);
    await card.updateComplete;
    const haCard = card.shadowRoot?.querySelector("ha-card");

    for (let index = 0; index < 2; index += 1) {
      haCard?.dispatchEvent(
        new MouseEvent("pointerdown", { button: 0, bubbles: true }),
      );
      haCard?.dispatchEvent(
        new MouseEvent("pointerup", { button: 0, bubbles: true }),
      );
    }

    expect(actionHandler).toHaveBeenCalledOnce();
    expect(actionHandler.mock.calls[0]?.[0]).toMatchObject({
      detail: { action: "double_tap" },
    });
    vi.runAllTimers();
    expect(actionHandler).toHaveBeenCalledOnce();
  });

  it("fires hold without also firing tap", async () => {
    vi.useFakeTimers();
    const card = new MoistureGaugeCard();
    const actionHandler = vi.fn();
    card.setConfig({
      type: "custom:moisture-gauge-card",
      entity: "sensor.plant_moisture",
      hold_action: { action: "more-info" },
    });
    card.hass = hassStub();
    card.addEventListener("hass-action", actionHandler);
    document.body.append(card);
    await card.updateComplete;
    const haCard = card.shadowRoot?.querySelector("ha-card");

    haCard?.dispatchEvent(
      new MouseEvent("pointerdown", { button: 0, bubbles: true }),
    );
    vi.advanceTimersByTime(500);
    haCard?.dispatchEvent(
      new MouseEvent("pointerup", { button: 0, bubbles: true }),
    );

    expect(actionHandler).toHaveBeenCalledOnce();
    expect(actionHandler.mock.calls[0]?.[0]).toMatchObject({
      detail: { action: "hold" },
    });
  });
});
