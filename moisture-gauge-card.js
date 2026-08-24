import { LitElement, html, css } from "https://cdn.jsdelivr.net/gh/lit/lit@3.3.3/+esm";

class MoistureGaugeCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    value: { state: true },
    stateText: { state: true },
  };

  constructor() {
    super();
    this.value = 0;
    this.stateText = "—";
  }

  setConfig(config) {
    this.config = {
      min: 0,
      max: 100,
      unit: "%",
      thresholds: {
        dry: 30,
        moist: 60,
      },
      ...config,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateValue();
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("hass")) {
      this.updateValue();
    }
  }

  updateValue() {
    if (!this.hass || !this.config?.entity) return;

    const state = this.hass.states[this.config.entity];
    if (!state) {
      this.stateText = "unavailable";
      this.value = 0;
      return;
    }

    const numValue = parseFloat(state.state);
    if (isNaN(numValue)) {
      this.stateText = state.state;
      this.value = 0;
      return;
    }

    this.value = numValue;
    this.stateText = `${numValue.toFixed(0)}${this.config.unit || ""}`;
  }

  getColor() {
    const {
      min = 0,
      max = 100,
      optimal = { min: 40, max: 70 },
      buffer = 5, // % range for yellow warning zones
    } = this.config || {};

    const normalized = ((this.value - min) / (max - min)) * 100;
    const lowerYellow = optimal.min - buffer;
    const upperYellow = optimal.max + buffer;

    // Red: outside yellow zones
    if (normalized < lowerYellow || normalized > upperYellow) return "#e74c3c";
    // Yellow: buffer zones around optimal
    if (normalized < optimal.min || normalized > optimal.max) return "#f39c12";
    // Green: inside optimal range
    return "#27ae60";
  }

  getNeedleAngle() {
    const { min = 0, max = 100 } = this.config || {};
    const normalized = (this.value - min) / (max - min);
    const startAngle = -135;
    const endAngle = 135;
    const range = endAngle - startAngle;
    return startAngle + normalized * range;
  }

  render() {
    if (!this.config?.entity) {
      return html`<div style="color: red; padding: 16px;">No entity configured</div>`;
    }

    const needleAngle = this.getNeedleAngle();
    const arcColor = this.getColor();
    const min = this.config.min || 0;
    const max = this.config.max || 100;
    const normalized = ((this.value - min) / (max - min)) * 100;

    const startX = 100 + 70 * Math.cos((-135 * Math.PI) / 180);
    const startY = 100 + 70 * Math.sin((-135 * Math.PI) / 180);
    const endX = 100 + 70 * Math.cos((135 * Math.PI) / 180);
    const endY = 100 + 70 * Math.sin((135 * Math.PI) / 180);

    const progressAngle = -135 + ((135 - -135) / 100) * normalized;
    const progressX = 100 + 70 * Math.cos((progressAngle * Math.PI) / 180);
    const progressY = 100 + 70 * Math.sin((progressAngle * Math.PI) / 180);
    const largeArc = normalized > 50 ? 1 : 0;

    const tickMarks = [0, 25, 50, 75, 100].map((tick) => {
      const angle = (-135 + (tick / 100) * 270) * (Math.PI / 180);
      const x1 = 100 + 65 * Math.cos(angle);
      const y1 = 100 + 65 * Math.sin(angle);
      const x2 = 100 + 72 * Math.cos(angle);
      const y2 = 100 + 72 * Math.sin(angle);
      return html`<line class="gauge-tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
    });

    return html`
      <div class="card-container">
        ${this.config.name ? html`<h2 class="card-title">${this.config.name}</h2>` : ""}
        <div class="gauge-wrapper">
          <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
            <path class="gauge-arc" d="M ${startX} ${startY} A 70 70 0 1 1 ${endX} ${endY}" stroke="var(--divider-color)" stroke-width="6" />
            <path class="gauge-arc" d="M ${startX} ${startY} A 70 70 0 ${largeArc} 1 ${progressX} ${progressY}" stroke="${arcColor}" stroke-width="6" />
            ${tickMarks}
            <line class="gauge-needle" x1="100" y1="100" x2="100" y2="40" style="transform: rotate(${needleAngle}deg)" />
            <circle class="gauge-center" cx="100" cy="100" r="4" />
            <text class="gauge-label" x="100" y="115">${this.value.toFixed(0)}</text>
            <text class="gauge-unit" x="100" y="128">${this.config.unit || "%"}</text>
          </svg>
        </div>
        <div class="state-text">${this.stateText}</div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 8px;
      }

      .card-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .card-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin: 0;
        text-align: center;
      }

      .gauge-wrapper {
        position: relative;
        width: 200px;
        height: 120px;
      }

      svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      .gauge-arc {
        fill: none;
        stroke-linecap: round;
      }

      .gauge-needle {
        fill: none;
        stroke: var(--primary-text-color);
        stroke-width: 2;
        stroke-linecap: round;
        transform-origin: 50% 50%;
        transition: transform 0.3s ease-out;
      }

      .gauge-center {
        fill: var(--primary-text-color);
      }

      .gauge-tick {
        stroke: var(--divider-color);
        stroke-width: 1;
      }

      .gauge-label {
        font-size: 32px;
        font-weight: 300;
        color: var(--primary-text-color);
        text-anchor: middle;
        dominant-baseline: middle;
      }

      .gauge-unit {
        font-size: 12px;
        color: var(--secondary-text-color);
        text-anchor: middle;
      }

      .state-text {
        font-size: 11px;
        color: var(--secondary-text-color);
        text-align: center;
        font-family: monospace;
      }
    `;
  }
}

customElements.define("moisture-gauge-card", MoistureGaugeCard);
