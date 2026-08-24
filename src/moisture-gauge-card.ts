import { css, html, LitElement, nothing, type PropertyValues } from "lit";

import { normalizeConfig } from "./config";
import {
  GAUGE_ARC_PATH,
  GAUGE_CENTER,
  gaugeAngle,
  getGaugeZone,
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
const CARD_TYPE = `custom:${CARD_TAG}` as const;
const HOLD_DELAY_MS = 500;
const DOUBLE_TAP_DELAY_MS = 250;
const TICKS = [0, 0.25, 0.5, 0.75, 1] as const;

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

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
}

function actionEnabled(action: { action?: string } | undefined): boolean {
  return Boolean(action?.action && action.action !== "none");
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
          <h2 class="card-title">${name}</h2>
          <div class="gauge-wrapper">
            <svg
              viewBox="0 0 200 160"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                class="gauge-arc"
                d=${GAUGE_ARC_PATH}
                pathLength="100"
              ></path>
              <path
                class="gauge-progress ${zone}"
                d=${GAUGE_ARC_PATH}
                pathLength="100"
                style=${`stroke-dasharray: ${progressPercent} 100; opacity: ${
                  value === null || progressPercent === 0 ? 0 : 1
                }`}
              ></path>
              ${TICKS.map((tick) => {
                const inner = pointOnGauge(tick, 64);
                const outer = pointOnGauge(tick, 74);
                return html`<line
                  class="gauge-tick"
                  x1=${inner.x}
                  y1=${inner.y}
                  x2=${outer.x}
                  y2=${outer.y}
                ></line>`;
              })}
              <line
                class="gauge-needle ${value === null ? "unavailable" : ""}"
                x1=${GAUGE_CENTER}
                y1=${GAUGE_CENTER}
                x2=${GAUGE_CENTER + 60}
                y2=${GAUGE_CENTER}
                style=${`transform: rotate(${gaugeAngle(progress)}deg)`}
              ></line>
              <circle
                class="gauge-center"
                cx=${GAUGE_CENTER}
                cy=${GAUGE_CENTER}
                r="4"
              ></circle>
              <text class="gauge-value" x="100" y="117">${display.value}</text>
              ${
                display.unit
                  ? html`<text class="gauge-unit" x="100" y="136">
                      ${display.unit}
                    </text>`
                  : nothing
              }
            </svg>
          </div>
          ${
            problem
              ? html`<div class="state-problem" role="status">${problem}</div>`
              : nothing
          }
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
      --gauge-width: 200px;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px;
    }

    .card-title {
      max-width: 100%;
      margin: 0;
      overflow: hidden;
      color: var(--primary-text-color, #212121);
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .gauge-wrapper {
      width: min(100%, var(--gauge-width));
      height: var(--gauge-height);
      aspect-ratio: 5 / 4;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .gauge-arc,
    .gauge-progress {
      fill: none;
      stroke-width: 6;
      stroke-linecap: round;
    }

    .gauge-arc {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.3));
    }

    .gauge-progress {
      transition:
        stroke-dasharray 300ms ease-out,
        stroke 200ms ease-out;
    }

    .gauge-progress.optimal {
      stroke: var(--success-color, #43a047);
    }

    .gauge-progress.warning {
      stroke: var(--warning-color, #ffa600);
    }

    .gauge-progress.critical {
      stroke: var(--error-color, #db4437);
    }

    .gauge-progress.unavailable {
      stroke: var(--disabled-text-color, #9e9e9e);
    }

    .gauge-tick {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.3));
      stroke-width: 1;
    }

    .gauge-needle {
      transform-box: view-box;
      transform-origin: 100px 100px;
      fill: none;
      stroke: var(--primary-text-color, #212121);
      stroke-width: 2;
      stroke-linecap: round;
      transition:
        transform 300ms ease-out,
        opacity 200ms ease-out;
    }

    .gauge-needle.unavailable {
      opacity: 0;
    }

    .gauge-center {
      fill: var(--primary-text-color, #212121);
    }

    .gauge-value,
    .gauge-unit {
      text-anchor: middle;
    }

    .gauge-value {
      fill: var(--primary-text-color, #212121);
      font-size: 30px;
      font-weight: 300;
    }

    .gauge-unit {
      fill: var(--secondary-text-color, #727272);
      font-size: 12px;
    }

    .state-problem {
      max-width: 100%;
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      overflow-wrap: anywhere;
    }

    @media (prefers-reduced-motion: reduce) {
      .gauge-progress,
      .gauge-needle {
        transition: none;
      }
    }
  `;
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, MoistureGaugeCard);
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: "Moisture Gauge Card",
    description: "A responsive 270° soil-moisture dial",
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
