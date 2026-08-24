import { css, html, LitElement, nothing, svg, type PropertyValues } from "lit";

import { normalizeConfig } from "./config";
import {
  GAUGE_TRACK_PATH,
  getGaugeZone,
  gaugePointerPath,
  normalizeGaugeValue,
  pointOnGauge,
} from "./gauge-math";
import {
  parseNumericState,
  resolveDisplayParts,
  resolveName,
  resolveStateProblem,
} from "./state";
import type {
  HomeAssistant,
  MoistureGaugeCardConfig,
  NormalizedMoistureGaugeCardConfig,
} from "./types";

const CARD_TAG = "moisture-gauge-card";
const EDITOR_TAG = "moisture-gauge-card-editor";
const CARD_TYPE = `custom:${CARD_TAG}` as const;
const EDITOR_DEBOUNCE_MS = 300;
const HOLD_DELAY_MS = 500;
const DOUBLE_TAP_DELAY_MS = 250;
const TICKS = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1] as const;
const MAJOR_TICKS = new Set([0, 0.25, 0.5, 0.75, 1]);

interface CustomCardEntry {
  type: string;
  name: string;
  description?: string;
  documentationURL?: string;
  preview?: boolean;
  getEntitySuggestion?: (
    hass: HomeAssistant,
    entityId: string,
  ) => { config: MoistureGaugeCardConfig } | null;
}

interface ConfigFormLoader extends CustomElementConstructor {
  getConfigElement?: () => unknown;
}

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
}

function actionEnabled(action: { action?: string } | undefined): boolean {
  return Boolean(action?.action && action.action !== "none");
}

function formatScaleLabel(value: number, language: string): string {
  return new Intl.NumberFormat(language, {
    maximumFractionDigits: 2,
  }).format(value);
}

export class MoistureGaugeCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  public config?: NormalizedMoistureGaugeCardConfig;
  private _holdTimer?: number;
  private _tapTimer?: number;
  private _holdTriggered = false;

  public static getConfigForm() {
    const actions = [
      "more-info",
      "navigate",
      "url",
      "perform-action",
      "assist",
      "none",
    ];

    return {
      schema: [
        {
          name: "entity",
          required: true,
          selector: { entity: { filter: [{ domain: "sensor" }] } },
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "name", selector: { text: {} } },
            { name: "unit", selector: { text: {} } },
          ],
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "min", selector: { number: { mode: "box" } } },
            { name: "max", selector: { number: { mode: "box" } } },
            { name: "buffer", selector: { number: { mode: "box", min: 0 } } },
          ],
        },
        {
          type: "expandable",
          name: "optimal",
          title: "Optimal range",
          schema: [
            { name: "min", selector: { number: { mode: "box" } } },
            { name: "max", selector: { number: { mode: "box" } } },
          ],
        },
        {
          type: "expandable",
          name: "interactions",
          title: "Interactions",
          flatten: true,
          schema: [
            {
              name: "tap_action",
              selector: {
                ui_action: { actions, default_action: "more-info" },
              },
              context: { entity: "entity" },
            },
            {
              name: "hold_action",
              selector: { ui_action: { actions, default_action: "none" } },
              context: { entity: "entity" },
            },
            {
              name: "double_tap_action",
              selector: { ui_action: { actions, default_action: "none" } },
              context: { entity: "entity" },
            },
          ],
        },
      ],
      computeLabel: (schema: { name: string }) => {
        const labels: Record<string, string> = {
          entity: "Moisture sensor",
          name: "Name",
          unit: "Unit",
          min: "Minimum",
          max: "Maximum",
          buffer: "Warning buffer",
          tap_action: "Tap action",
          hold_action: "Hold action",
          double_tap_action: "Double-tap action",
        };
        return labels[schema.name];
      },
      computeHelper: (schema: { name: string }) => {
        if (schema.name === "buffer") {
          return "Warning-zone width in the sensor's unit";
        }
        return undefined;
      },
      assertConfig: (config: MoistureGaugeCardConfig) => {
        normalizeConfig(config);
      },
    };
  }

  public static getConfigElement(): MoistureGaugeCardEditor {
    return document.createElement(EDITOR_TAG) as MoistureGaugeCardEditor;
  }

  public static getStubConfig(
    hass: HomeAssistant,
    entities: string[] = [],
    entitiesFallback: string[] = [],
  ): Omit<MoistureGaugeCardConfig, "type"> {
    const candidates = [
      ...new Set([
        ...entities,
        ...entitiesFallback,
        ...Object.keys(hass.states),
      ]),
    ].filter((entityId) => entityId.startsWith("sensor."));
    const moistureEntity = candidates.find(
      (entityId) =>
        hass.states[entityId]?.attributes.device_class === "moisture",
    );
    const numericEntity = candidates.find(
      (entityId) => parseNumericState(hass.states[entityId]) !== null,
    );
    return { entity: moistureEntity ?? numericEntity ?? candidates[0] ?? "" };
  }

  public setConfig(config: MoistureGaugeCardConfig): void {
    this.config = normalizeConfig(config);
  }

  public getCardSize(): number {
    return 3;
  }

  public getGridOptions() {
    return {
      rows: 3,
      columns: 6,
      min_rows: 3,
      min_columns: 3,
    };
  }

  public override disconnectedCallback(): void {
    this._clearGestureTimers();
    super.disconnectedCallback();
  }

  protected override shouldUpdate(
    changedProperties: PropertyValues<this>,
  ): boolean {
    if (changedProperties.has("config")) return true;
    if (!changedProperties.has("hass")) return false;

    const oldHass = changedProperties.get("hass");
    if (!oldHass || !this.hass || !this.config) return true;
    return (
      oldHass.states[this.config.entity] !==
        this.hass.states[this.config.entity] ||
      oldHass.language !== this.hass.language ||
      oldHass.entities !== this.hass.entities
    );
  }

  protected override render() {
    if (!this.hass || !this.config) return nothing;

    const state = this.hass.states[this.config.entity];
    const value = parseNumericState(state);
    const progress =
      value === null
        ? 0
        : normalizeGaugeValue(value, this.config.min, this.config.max);
    const display = resolveDisplayParts(this.hass, state, value, this.config);
    const name = resolveName(this.hass, state, this.config);
    const problem = resolveStateProblem(
      this.hass,
      state,
      value,
      this.config.entity,
    );
    const zone =
      value === null
        ? "unavailable"
        : getGaugeZone(value, this.config.optimal, this.config.buffer);
    const progressPercent = progress * 100;
    const pointer = pointOnGauge(progress);
    const ariaValue = display.unit
      ? `${display.value} ${display.unit}`
      : display.value;
    const ariaLabel = problem ? `${name}: ${problem}` : `${name}: ${ariaValue}`;

    return html`
      <ha-card
        class="interactive"
        role="button"
        tabindex="0"
        aria-label=${ariaLabel}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @keydown=${this._onKeyDown}
        @contextmenu=${this._onContextMenu}
      >
        <div class="card-content">
          <div class="instrument">
            <div class="scale-face">
              <svg
                viewBox="0 0 640 104"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  class="gauge-track"
                  d=${GAUGE_TRACK_PATH}
                  pathLength="100"
                ></path>
                <path
                  class="gauge-progress ${zone}"
                  d=${GAUGE_TRACK_PATH}
                  pathLength="100"
                  style=${`stroke-dasharray: ${progressPercent} 100; opacity: ${
                    value === null || progressPercent === 0 ? 0 : 1
                  }`}
                ></path>
                ${TICKS.map((tick) => {
                  const position = pointOnGauge(tick);
                  const major = MAJOR_TICKS.has(tick);
                  const labelValue =
                    this.config!.min +
                    (this.config!.max - this.config!.min) * tick;
                  return svg`<line
                      class="gauge-tick ${major ? "major" : "minor"}"
                      x1=${position.x}
                      y1=${major ? 66 : 70}
                      x2=${position.x}
                      y2="87"
                    ></line>
                    ${
                      major
                        ? svg`<text
                            class="scale-number"
                            x=${position.x}
                            y="43"
                          >
                            ${formatScaleLabel(labelValue, this.hass!.language)}
                          </text>`
                        : nothing
                    }`;
                })}
                <line
                  class="gauge-indicator ${zone} ${
                    value === null ? "unavailable" : ""
                  }"
                  x1=${pointer.x}
                  y1="56"
                  x2=${pointer.x}
                  y2="91"
                ></line>
                <path
                  class="gauge-pointer ${zone} ${
                    value === null ? "unavailable" : ""
                  }"
                  d=${gaugePointerPath(progress)}
                ></path>
              </svg>
            </div>
            <div class="instrument-lower">
              <h2 class="card-title">${name}</h2>
              <div class="readout">
                <span class="gauge-value">${display.value}</span>
                ${
                  display.unit && value !== null
                    ? html`<span class="gauge-unit">${display.unit}</span>`
                    : nothing
                }
              </div>
              ${
                problem
                  ? html`<div class="state-problem" role="status">
                      ${problem}
                    </div>`
                  : nothing
              }
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  private _onPointerDown(event: PointerEvent): void {
    if (event.button !== 0 || !this.config) return;
    this._holdTriggered = false;
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    if (actionEnabled(this.config.hold_action)) {
      this._holdTimer = window.setTimeout(() => {
        this._holdTriggered = true;
        this._runAction("hold");
      }, HOLD_DELAY_MS);
    }
  }

  private _onPointerUp(event: PointerEvent): void {
    if (event.button !== 0 || !this.config) return;
    this._clearHoldTimer();
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    if (this._holdTriggered) return;

    if (!actionEnabled(this.config.double_tap_action)) {
      this._runAction("tap");
      return;
    }

    if (this._tapTimer !== undefined) {
      window.clearTimeout(this._tapTimer);
      this._tapTimer = undefined;
      this._runAction("double_tap");
      return;
    }

    this._tapTimer = window.setTimeout(() => {
      this._tapTimer = undefined;
      this._runAction("tap");
    }, DOUBLE_TAP_DELAY_MS);
  }

  private _onPointerCancel(): void {
    this._clearHoldTimer();
    this._holdTriggered = false;
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if ((event.key !== "Enter" && event.key !== " ") || event.repeat) return;
    event.preventDefault();
    this._runAction("tap");
  }

  private _onContextMenu(event: Event): void {
    if (this.config && actionEnabled(this.config.hold_action)) {
      event.preventDefault();
    }
  }

  private _runAction(action: "tap" | "hold" | "double_tap"): void {
    if (!this.hass || !this.config) return;
    this.dispatchEvent(
      new CustomEvent("hass-action", {
        bubbles: true,
        composed: true,
        detail: { config: this.config, action },
      }),
    );
  }

  private _clearHoldTimer(): void {
    if (this._holdTimer !== undefined) {
      window.clearTimeout(this._holdTimer);
      this._holdTimer = undefined;
    }
  }

  private _clearGestureTimers(): void {
    this._clearHoldTimer();
    if (this._tapTimer !== undefined) {
      window.clearTimeout(this._tapTimer);
      this._tapTimer = undefined;
    }
  }

  static override styles = css`
    :host {
      display: block;
      --gauge-width: 640px;
      --gauge-height: auto;
    }

    ha-card {
      overflow: hidden;
    }

    ha-card.interactive {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    ha-card.interactive:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }

    .card-content {
      padding: 10px;
    }

    .instrument {
      box-sizing: border-box;
      width: min(100%, var(--gauge-width));
      height: var(--gauge-height);
      margin-inline: auto;
      overflow: hidden;
      border: 3px solid
        var(--moisture-gauge-bezel-color, rgba(160, 164, 166, 0.9));
      border-radius: 14px;
      background: var(
        --moisture-gauge-panel-color,
        var(--secondary-background-color, #d8d4c8)
      );
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.45),
        inset 0 -2px 5px rgba(0, 0, 0, 0.14);
    }

    .scale-face {
      margin: 7px 7px 0;
      overflow: hidden;
      background: var(--moisture-gauge-face-color, #17191b);
      clip-path: polygon(2.5% 0, 97.5% 0, 100% 100%, 0 100%);
    }

    .card-title {
      min-width: 0;
      margin: 0;
      overflow: hidden;
      color: var(--primary-text-color, #212121);
      font-family: "Roboto Condensed", "Arial Narrow", sans-serif;
      font-size: 13px;
      font-weight: 700;
      line-height: 20px;
      letter-spacing: 0.08em;
      text-overflow: ellipsis;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .instrument-lower {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 6px 12px;
      align-items: center;
      padding: 9px 13px 10px;
    }

    svg {
      display: block;
      width: 100%;
      aspect-ratio: 640 / 104;
    }

    .gauge-track,
    .gauge-progress {
      fill: none;
      stroke-width: 6;
      stroke-linecap: butt;
    }

    .gauge-track {
      stroke: var(--moisture-gauge-dial-color, #f2f0e8);
      opacity: 0.42;
    }

    .gauge-progress {
      stroke: var(--gauge-zone-color);
      transition:
        stroke-dasharray 300ms ease-out,
        stroke 200ms ease-out;
    }

    .optimal {
      --gauge-zone-color: var(--success-color, #43a047);
    }

    .warning {
      --gauge-zone-color: var(--warning-color, #ffa600);
    }

    .critical {
      --gauge-zone-color: var(--error-color, #db4437);
    }

    .unavailable {
      --gauge-zone-color: var(--disabled-text-color, #9e9e9e);
    }

    .gauge-tick {
      stroke: var(--moisture-gauge-dial-color, #f2f0e8);
    }

    .gauge-tick.major {
      stroke-width: 2.5;
    }

    .gauge-tick.minor {
      stroke-width: 1.5;
      opacity: 0.78;
    }

    .scale-number {
      fill: var(--moisture-gauge-dial-color, #f2f0e8);
      font-family: "Roboto Condensed", "Arial Narrow", sans-serif;
      font-size: 21px;
      font-weight: 700;
      letter-spacing: 1px;
      text-anchor: middle;
    }

    .gauge-indicator {
      fill: none;
      stroke: var(--gauge-zone-color);
      stroke-width: 2.5;
      transition:
        x1 300ms ease-out,
        x2 300ms ease-out,
        opacity 200ms ease-out;
    }

    .gauge-pointer {
      fill: var(--gauge-zone-color);
      stroke: none;
      transition:
        d 300ms ease-out,
        opacity 200ms ease-out;
    }

    .gauge-indicator.unavailable,
    .gauge-pointer.unavailable {
      opacity: 0;
    }

    .readout {
      display: flex;
      min-width: 92px;
      min-height: 32px;
      box-sizing: border-box;
      align-items: baseline;
      justify-content: center;
      gap: 4px;
      padding: 3px 9px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      background: var(--moisture-gauge-readout-color, #17191b);
      box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.75);
      color: var(--moisture-gauge-dial-color, #f2f0e8);
      font-variant-numeric: tabular-nums;
    }

    .gauge-value {
      font-family: "Roboto Mono", "Courier New", monospace;
      font-size: 22px;
      font-weight: 600;
      line-height: 24px;
    }

    .gauge-unit {
      font-size: 11px;
      font-weight: 700;
    }

    .state-problem {
      grid-column: 1 / -1;
      max-width: 100%;
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      line-height: 16px;
      overflow-wrap: anywhere;
    }

    @media (prefers-reduced-motion: reduce) {
      .gauge-progress,
      .gauge-indicator,
      .gauge-pointer {
        transition: none;
      }
    }
  `;
}

export class MoistureGaugeCardEditor extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  public hass?: HomeAssistant;
  private _config?: MoistureGaugeCardConfig;
  private _configChangedTimer?: number;

  public override connectedCallback(): void {
    super.connectedCallback();
    if (!customElements.get("ha-form")) {
      const buttonCard = customElements.get("hui-button-card") as
        ConfigFormLoader | undefined;
      void buttonCard?.getConfigElement?.();
    }
  }

  public setConfig(config: MoistureGaugeCardConfig): void {
    this._clearConfigChangedTimer();
    this._config = config;
  }

  public override disconnectedCallback(): void {
    this._clearConfigChangedTimer();
    super.disconnectedCallback();
  }

  protected override render() {
    if (!this.hass || !this._config) return nothing;

    const { schema, computeLabel, computeHelper } =
      MoistureGaugeCard.getConfigForm();

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${computeLabel}
        .computeHelper=${computeHelper}
        @value-changed=${this._onValueChanged}
      ></ha-form>
    `;
  }

  private _onValueChanged(
    event: CustomEvent<{ value: MoistureGaugeCardConfig }>,
  ): void {
    this._config = event.detail.value;
    this._clearConfigChangedTimer();
    this._configChangedTimer = window.setTimeout(() => {
      this._configChangedTimer = undefined;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          bubbles: true,
          composed: true,
          detail: { config: this._config },
        }),
      );
    }, EDITOR_DEBOUNCE_MS);
  }

  private _clearConfigChangedTimer(): void {
    if (this._configChangedTimer !== undefined) {
      window.clearTimeout(this._configChangedTimer);
      this._configChangedTimer = undefined;
    }
  }
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, MoistureGaugeCard);
}

if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, MoistureGaugeCardEditor);
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: "Moisture Gauge Card",
    description: "A horizontal, vintage-inspired soil-moisture gauge",
    preview: true,
    documentationURL: "https://github.com/bardagi/ha-horizontal-gauge",
    getEntitySuggestion: (hass, entityId) => {
      const state = hass.states[entityId];
      if (
        !entityId.startsWith("sensor.") ||
        state?.attributes.device_class !== "moisture"
      ) {
        return null;
      }
      return {
        config: { type: CARD_TYPE, entity: entityId },
      };
    },
  });
}
