# Moisture Gauge Card

A responsive, theme-aware horizontal soil-moisture gauge for Home Assistant 2026.6 and newer. Its wide linear scale and high-contrast instrument face are inspired by the classic Volvo Amazon speedometer. It supports graphical configuration, dashboard actions, Sections sizing, and offline operation after installation.

## Installation

### HACS custom repository

1. Open HACS and select the three-dot menu.
2. Select **Custom repositories**.
3. Add `https://github.com/bardagi/ha-horizontal-gauge` with category **Dashboard**.
4. Install **Moisture Gauge Card** and refresh Home Assistant.

HACS registers `moisture-gauge-card.js` automatically.

### Manual installation

1. Download `moisture-gauge-card.js` from the latest GitHub release.
2. Copy it to `<config>/www/moisture-gauge-card.js`.
3. Add `/local/moisture-gauge-card.js` as a JavaScript module under **Settings → Dashboards → Resources**.
4. Refresh the browser.

The release bundle includes Lit and uses Home Assistant's native card-action event. It makes no runtime CDN requests.

## Configuration

The card is available in Home Assistant's card picker and visual editor. Existing YAML configurations continue to work.

### Basic

```yaml
type: custom:moisture-gauge-card
entity: sensor.bjorkefiken_moisture
name: Bjørkefiken
```

### All options

```yaml
type: custom:moisture-gauge-card
entity: sensor.plant_soil_moisture
layout: simple
name: Plant Name
unit: "%"
min: 0
max: 100
optimal:
  min: 40
  max: 70
buffer: 5
tap_action:
  action: more-info
hold_action:
  action: none
double_tap_action:
  action: none
```

| Option              | Required | Default               | Description                                 |
| ------------------- | -------- | --------------------- | ------------------------------------------- |
| `entity`            | Yes      | —                     | Numeric sensor to display.                  |
| `layout`            | No       | `simple`              | `compact`, `simple`, or `volvo`.            |
| `name`              | No       | Entity name           | Card title.                                 |
| `unit`              | No       | Entity unit, then `%` | Display unit. Set `""` to hide it.          |
| `min`               | No       | `0`                   | Gauge minimum.                              |
| `max`               | No       | `100`                 | Gauge maximum. Must exceed `min`.           |
| `optimal.min`       | No       | `40`                  | Inclusive lower bound of the optimal range. |
| `optimal.max`       | No       | `70`                  | Inclusive upper bound of the optimal range. |
| `buffer`            | No       | `5`                   | Warning-zone width in the sensor's unit.    |
| `tap_action`        | No       | `more-info`           | Action performed on tap or Enter/Space.     |
| `hold_action`       | No       | `none`                | Action performed after holding for 500 ms.  |
| `double_tap_action` | No       | `none`                | Action performed on double tap.             |

Values inside `optimal` are green. Values up to `buffer` below or above that range are yellow. Values outside the buffered range are red. Thresholds use the sensor's raw unit, even when `min` and `max` are customized.

Values outside `min` and `max` are displayed unchanged while the horizontal marker is clamped to the nearest endpoint. Missing, unknown, unavailable, malformed, and infinite states display a neutral gauge and `—`; they are never interpreted as zero.

### Layouts

- `compact` shows only the theme-aware horizontal line and zone-colored position arrow.
- `simple` adds the entity name, formatted value, and an explicit `Optimal`, `Below optimal`, `Above optimal`, or `Unavailable` status.
- `volvo` keeps the full vintage instrument styling. Its droplet-and-`MOISTURE` warning lamp is dim while the value is optimal or unavailable, amber in the warning buffer, and red in the critical zone.

Compact, Simple, and Volvo report one, two, and three suggested dashboard rows respectively. All layouts support the same tap, hold, and double-tap actions.

## Multiple plants

```yaml
type: grid
columns: 3
cards:
  - type: custom:moisture-gauge-card
    entity: sensor.bjorkefiken_moisture
    name: Bjørkefiken
    optimal:
      min: 45
      max: 65

  - type: custom:moisture-gauge-card
    entity: sensor.fredslilije_moisture
    name: Fredslilje
    optimal:
      min: 50
      max: 70

  - type: custom:moisture-gauge-card
    entity: sensor.dracena_moisture
    name: Dracena
    optimal:
      min: 40
      max: 60
```

Typical starting ranges vary by sensor and substrate:

- Succulents: 20–40%
- Ficus and Dracaena: 35–55%
- Tropical plants: 50–70%
- Ferns and Calathea: 60–80%

## History

Combine the gauge with Home Assistant's history graph card:

```yaml
type: vertical-stack
cards:
  - type: custom:moisture-gauge-card
    entity: sensor.plant_moisture
    name: Soil Moisture

  - type: history-graph
    title: Moisture history
    hours_to_show: 24
    entities:
      - sensor.plant_moisture
```

## Themes and sizing

The card uses Home Assistant's `--primary-text-color`, `--secondary-text-color`, `--divider-color`, `--success-color`, `--warning-color`, and `--error-color` theme variables.

It also exposes:

- `--gauge-width`, default `640px`
- `--gauge-height`, default `auto`
- `--moisture-gauge-face-color`, default `#17191b`
- `--moisture-gauge-panel-color`, default theme secondary background
- `--moisture-gauge-bezel-color`, default muted silver
- `--moisture-gauge-dial-color`, default `#f2f0e8`
- `--moisture-gauge-readout-color`, default `#17191b`

These custom properties can be supplied globally by a Home Assistant theme. The gauge automatically shrinks to fit narrow cards.

## Development

Requires Node.js 24 or newer.

```bash
npm install
npm run check
```

Source lives in `src/`; the HACS and release artifact is `dist/moisture-gauge-card.js`. The complete check runs formatting, linting, type checking, tests, a production build, and a remote-import inspection.

## License

[MIT](LICENSE)
