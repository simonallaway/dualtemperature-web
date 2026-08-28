# Dual Temperature

A tiny static weather site for GitHub Pages.

## What it does

- Uses browser geolocation to get the visitor's current location.
- Uses Open-Meteo for the current temperature.
- Shows both Fahrenheit and Celsius.
- Lets the user choose which unit is primary.
- Uses the chosen unit for the large temperature and the fixed left-hand scale.
- Remembers the unit preference in `localStorage`.
- Designed for iPhone Safari and **Add to Home Screen**.

## Deploy with GitHub Pages

1. In GitHub open **Settings → Pages**.
2. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
3. Save.

The site should then appear at:

`https://[github-username].github.io/dualtemperature-web/`

## iPhone

Open the GitHub Pages URL in Safari. Allow location access when prompted, then use:

**Share → Add to Home Screen**

## Weather data

Weather data is provided by [Open-Meteo](https://open-meteo.com/).
