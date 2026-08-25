import { afterEach, describe, expect, it, vi } from "vitest";

import {
  HorizontalGaugeCard,
  HorizontalGaugeCardEditor,
} from "../src/horizontal-gauge-card";
import type { HomeAssistant } from "../src/types";

function entityState(value: string, attributes: Record<string, unknown> = {}) {
  return {
    entity_id: "sensor.test_sensor",
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
    friendly_name: "Kitchen Sensor",
    unit_of_measurement: "%",
  });
  return {
    states: { "sensor.test_sensor": state },
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

async function renderCard(
  value = "50",
  layout?: "compact" | "simple" | "volvo",
) {
  const card = new HorizontalGaugeCard();
  card.setConfig({
    type: "custom:horizontal-gauge-card",
    entity: "sensor.test_sensor",
    layout,
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

describe("HorizontalGaugeCard", () => {
  it("renders a standard, accessible Home Assistant card", async () => {
    const card = await renderCard("50");
    const haCard = card.shadowRoot?.querySelector("ha-card");

    expect(haCard).not.toBeNull();
    expect(haCard?.getAttribute("role")).toBe("button");
    expect(haCard?.getAttribute("tabindex")).toBe("0");
    expect(haCard?.getAttribute("aria-label")).toBe(
      "Kitchen Sensor: 50 %, Optimal",
    );
    expect(
      card.shadowRoot?.querySelector(".gauge-progress.optimal"),
    ).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".state-problem")).toBeNull();
  });

  it("renders unavailable states neutrally instead of as zero", async () => {
    const card = await renderCard("unavailable");
    const value = card.shadowRoot?.querySelector(".simple-value");
    const progress = card.shadowRoot?.querySelector(
      ".gauge-progress.unavailable",
    );

    expect(value?.textContent?.trim()).toBe("—");
    expect(progress?.getAttribute("style")).toContain("opacity: 0");
    expect(
      card.shadowRoot?.querySelector(".gauge-pointer.unavailable"),
    ).not.toBeNull();
    expect(
      card.shadowRoot?.querySelector(".simple-status")?.textContent,
    ).toContain("Unavailable");
  });

  it("renders a missing entity as a neutral error", async () => {
    const card = new HorizontalGaugeCard();
    const hass = hassStub();
    hass.states = {};
    card.setConfig({
      type: "custom:horizontal-gauge-card",
      entity: "sensor.missing_sensor",
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;

    expect(
      card.shadowRoot?.querySelector(".simple-value")?.textContent?.trim(),
    ).toBe("—");
    expect(
      card.shadowRoot?.querySelector(".state-problem")?.textContent,
    ).toContain("Entity not found");
  });

  it("displays an out-of-range value while clamping visual progress", async () => {
    const card = await renderCard("150");
    const progress = card.shadowRoot?.querySelector(".gauge-progress");

    expect(
      card.shadowRoot?.querySelector(".simple-value")?.textContent?.trim(),
    ).toBe("150");
    expect(progress?.getAttribute("style")).toContain(
      "stroke-dasharray: 100 100",
    );
  });

  it("suppresses the unit when configured with an empty string", async () => {
    const card = new HorizontalGaugeCard();
    card.setConfig({
      type: "custom:horizontal-gauge-card",
      entity: "sensor.test_sensor",
      unit: "",
    });
    card.hass = hassStub("50");
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".simple-unit")).toBeNull();
  });

  it("exposes the visual editor schema and layout sizing", () => {
    const form = HorizontalGaugeCard.getConfigForm();
    const optimal = form.schema.find((entry) => entry.name === "optimal");
    const lamp = form.schema.find((entry) => entry.name === "lamp");
    const layout = form.schema.find((entry) => entry.name === "layout");

    expect(optimal).toMatchObject({
      type: "expandable",
      name: "optimal",
    });
    expect(lamp).toMatchObject({
      type: "expandable",
      name: "lamp",
    });
    expect(layout).toMatchObject({
      name: "layout",
      selector: {
        select: {
          options: [
            { value: "compact", label: "Compact" },
            { value: "simple", label: "Simple" },
            { value: "volvo", label: "Volvo" },
          ],
        },
      },
    });
    expect(new HorizontalGaugeCard().getCardSize()).toBe(2);
    expect(new HorizontalGaugeCard().getGridOptions()).toEqual({
      rows: 2,
      columns: 6,
      min_rows: 2,
      min_columns: 3,
    });
  });

  it("renders Compact as only a zone-colored line and arrow", async () => {
    const card = await renderCard("35", "compact");

    expect(card.shadowRoot?.querySelector(".minimal-gauge")).not.toBeNull();
    expect(
      card.shadowRoot?.querySelector(".gauge-progress.warning"),
    ).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".instrument")).toBeNull();
    expect(card.shadowRoot?.querySelector(".simple-header")).toBeNull();
    expect(card.shadowRoot?.querySelector(".scale-number")).toBeNull();
    expect(card.shadowRoot?.querySelector(".gauge-value")).toBeNull();
    expect(
      card.shadowRoot?.querySelector("ha-card")?.getAttribute("aria-label"),
    ).toContain("Below optimal");
    expect(card.getCardSize()).toBe(1);
    expect(card.getGridOptions()).toMatchObject({ rows: 1, min_rows: 1 });
  });

  it.each([
    ["50", "Optimal", "optimal"],
    ["39", "Below optimal", "warning"],
    ["71", "Above optimal", "warning"],
    ["34", "Below optimal", "critical"],
    ["76", "Above optimal", "critical"],
    ["unavailable", "Unavailable", "unavailable"],
  ])(
    "renders Simple value %s with %s status",
    async (value, expectedStatus, expectedZone) => {
      const card = await renderCard(value, "simple");
      const status = card.shadowRoot?.querySelector(".simple-status");

      expect(card.shadowRoot?.querySelector(".simple-title")?.textContent).toBe(
        "Kitchen Sensor",
      );
      expect(card.shadowRoot?.querySelector(".simple-value")?.textContent).toBe(
        value === "unavailable" ? "—" : value,
      );
      expect(status?.textContent).toBe(expectedStatus);
      expect(status?.classList.contains(expectedZone)).toBe(true);
      expect(
        card.shadowRoot?.querySelector("ha-card")?.getAttribute("aria-label"),
      ).toContain(expectedStatus);
      expect(card.shadowRoot?.querySelector(".instrument")).toBeNull();
      expect(card.getCardSize()).toBe(2);
      expect(card.getGridOptions()).toMatchObject({ rows: 2, min_rows: 2 });
    },
  );

  it.each([
    ["40", "optimal", false],
    ["70", "optimal", false],
    ["35", "warning", true],
    ["75", "warning", true],
    ["34.99", "critical", true],
    ["75.01", "critical", true],
    ["unavailable", "unavailable", false],
  ])(
    "sets the Volvo status lamp for value %s",
    async (value, expectedZone, illuminated) => {
      const card = await renderCard(value, "volvo");
      const lamp = card.shadowRoot?.querySelector(".status-lamp");
      const icon = card.shadowRoot?.querySelector(".status-lamp-icon");

      expect(icon?.tagName).toBe("HA-ICON");
      expect((icon as HTMLElement & { icon?: string })?.icon).toBe(
        "mdi:circle",
      );
      expect(lamp?.querySelector("span")).toBeNull();
      expect(lamp?.classList.contains(expectedZone)).toBe(true);
      expect(
        illuminated &&
          (lamp?.classList.contains("warning") ||
            lamp?.classList.contains("critical")),
      ).toBe(illuminated);
      expect(card.shadowRoot?.querySelector(".instrument")).not.toBeNull();
      expect(card.getCardSize()).toBe(3);
    },
  );

  it.each([
    ["50", "In range"],
    ["35", "Out of range"],
  ])(
    "uses the configured status lamp icon and label for value %s",
    async (value, expectedLabel) => {
      const card = new HorizontalGaugeCard();
      card.setConfig({
        type: "custom:horizontal-gauge-card",
        entity: "sensor.test_sensor",
        layout: "volvo",
        lamp: {
          icon: "mdi:water",
          label: "In range",
          alert_label: "Out of range",
        },
      });
      card.hass = hassStub(value);
      document.body.append(card);
      await card.updateComplete;

      const icon = card.shadowRoot?.querySelector(".status-lamp-icon");
      const label = card.shadowRoot?.querySelector(".status-lamp span");

      expect((icon as HTMLElement & { icon?: string })?.icon).toBe("mdi:water");
      expect(label?.textContent).toBe(expectedLabel);
    },
  );

  it("debounces visual editor changes so multi-digit maximums stay editable", async () => {
    vi.useFakeTimers();
    const editor = HorizontalGaugeCard.getConfigElement();
    const configChanged = vi.fn();
    const baseConfig = {
      type: "custom:horizontal-gauge-card" as const,
      entity: "sensor.test_sensor",
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

    expect(editor).toBeInstanceOf(HorizontalGaugeCardEditor);
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
    const styles = String(HorizontalGaugeCard.styles);

    expect(styles).toContain("var(--success-color");
    expect(styles).toContain("var(--warning-color");
    expect(styles).toContain("var(--error-color");
    expect(styles).toContain("var(--gauge-face-color");
    expect(styles).toContain("var(--gauge-bezel-color");
    expect(styles).toContain("prefers-reduced-motion");
  });

  it("renders a wide horizontal scale with aligned ticks and marker", async () => {
    const card = await renderCard("50", "volvo");
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

  it("suggests itself for any numeric sensor", () => {
    const metadata = window.customCards?.find(
      (entry) => entry.type === "horizontal-gauge-card",
    );
    const hass = hassStub();
    hass.states["sensor.non_numeric"] = entityState("on");

    expect(metadata?.getEntitySuggestion?.(hass, "sensor.test_sensor")).toEqual(
      {
        config: {
          type: "custom:horizontal-gauge-card",
          entity: "sensor.test_sensor",
        },
      },
    );
    expect(metadata?.getEntitySuggestion?.(hass, "light.kitchen")).toBeNull();
    expect(
      metadata?.getEntitySuggestion?.(hass, "sensor.non_numeric"),
    ).toBeNull();
  });

  it("runs the configured tap action from the keyboard", async () => {
    const card = new HorizontalGaugeCard();
    const hass = hassStub("50");
    const actionHandler = vi.fn();
    card.setConfig({
      type: "custom:horizontal-gauge-card",
      entity: "sensor.test_sensor",
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
          entity: "sensor.test_sensor",
          tap_action: { action: "toggle" },
        },
      },
    });
  });

  it("distinguishes double tap from a single tap", async () => {
    vi.useFakeTimers();
    const card = new HorizontalGaugeCard();
    const actionHandler = vi.fn();
    card.setConfig({
      type: "custom:horizontal-gauge-card",
      entity: "sensor.test_sensor",
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
    const card = new HorizontalGaugeCard();
    const actionHandler = vi.fn();
    card.setConfig({
      type: "custom:horizontal-gauge-card",
      entity: "sensor.test_sensor",
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
