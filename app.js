(() => {
  const chooseF = document.getElementById("chooseF");
  const chooseC = document.getElementById("chooseC");
  const primaryTemp = document.getElementById("primaryTemp");
  const secondaryTemp = document.getElementById("secondaryTemp");
  const locationLabel = document.getElementById("locationLabel");
  const statusText = document.getElementById("statusText");
  const leftUnit = document.getElementById("leftUnit");
  const rightUnit = document.getElementById("rightUnit");
  const scaleNote = document.getElementById("scaleNote");
  const scale = document.getElementById("scaleRows");
  const marker = document.getElementById("currentMarker");
  const markerLabel = document.getElementById("markerLabel");

  let preferredUnit = localStorage.getItem("temperatureUnit") === "C" ? "C" : "F";
  let currentC = null;
  let currentF = null;

  const fToC = f => (f - 32) * 5 / 9;
  const cToF = c => c * 9 / 5 + 32;

  function clean(n) {
    const r = Math.round(n * 10) / 10;
    return Number.isInteger(r) ? String(r) : r.toFixed(1);
  }

  function setPreference(unit) {
    preferredUnit = unit;
    localStorage.setItem("temperatureUnit", unit);
    render();
  }

  function renderScale() {
    scale.querySelectorAll(".row").forEach(el => el.remove());

    const isF = preferredUnit === "F";
    const max = isF ? 130 : 50;
    const min = -40;
    const current = isF ? currentF : currentC;

    chooseF.setAttribute("aria-pressed", String(isF));
    chooseC.setAttribute("aria-pressed", String(!isF));
    leftUnit.textContent = isF ? "Fahrenheit" : "Celsius";
    rightUnit.textContent = isF ? "Celsius" : "Fahrenheit";
    scaleNote.textContent = isF
      ? "130°F → −40°F · 10° Fahrenheit increments"
      : "50°C → −40°C · 10° Celsius increments";

    for (let v = max; v >= min; v -= 10) {
      const converted = isF ? fToC(v) : cToF(v);
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML =
        '<div class="left">' + clean(v) + '°</div>' +
        '<div class="track"><span class="tick"></span></div>' +
        '<div class="right">' + clean(converted) + '°</div>';
      scale.appendChild(row);
    }

    if (current == null) {
      marker.classList.add("hidden");
      return;
    }

    const firstRow = scale.querySelector(".row");
    const rowHeight = parseFloat(getComputedStyle(firstRow).height);
    const clamped = Math.max(min, Math.min(max, current));
    const positionRows = (max - clamped) / 10;

    marker.style.top = (positionRows * rowHeight + rowHeight / 2) + "px";
    markerLabel.textContent = "NOW · " + clean(current) + "°" + preferredUnit;
    marker.classList.remove("hidden");
  }

  function render() {
    const isF = preferredUnit === "F";
    chooseF.setAttribute("aria-pressed", String(isF));
    chooseC.setAttribute("aria-pressed", String(!isF));

    if (currentC == null || currentF == null) {
      primaryTemp.textContent = "--°" + preferredUnit;
      secondaryTemp.textContent = "--°" + (isF ? "C" : "F");
    } else {
      primaryTemp.textContent = clean(isF ? currentF : currentC) + "°" + preferredUnit;
      secondaryTemp.textContent = clean(isF ? currentC : currentF) + "°" + (isF ? "C" : "F");
    }

    renderScale();
  }

  async function loadWeather(lat, lon) {
    statusText.textContent = "Loading current temperature…";

    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", lat);
    url.searchParams.set("longitude", lon);
    url.searchParams.set("current", "temperature_2m");
    url.searchParams.set("temperature_unit", "celsius");
    url.searchParams.set("timezone", "auto");

    const weatherResponse = await fetch(url);

    if (!weatherResponse.ok) throw new Error("Weather request failed");
    const weather = await weatherResponse.json();

    currentC = weather.current?.temperature_2m;
    if (typeof currentC !== "number") throw new Error("Temperature missing from weather response");

    currentF = cToF(currentC);
    locationLabel.textContent = "Current location";
    statusText.textContent = "Updated from your current location";
    render();
  }

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      locationLabel.textContent = "Location unavailable";
      statusText.textContent = "This browser does not support geolocation.";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        loadWeather(latitude, longitude).catch(() => {
          locationLabel.textContent = "Current location";
          statusText.textContent = "Could not load weather data. Try reloading the page.";
        });
      },
      error => {
        locationLabel.textContent = "Location permission needed";
        if (error.code === error.PERMISSION_DENIED) {
          statusText.textContent = "Allow location access in Safari, then reload.";
        } else {
          statusText.textContent = "Could not determine your location. Try reloading.";
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000
      }
    );
  }

  chooseF.addEventListener("click", () => setPreference("F"));
  chooseC.addEventListener("click", () => setPreference("C"));

  render();
  requestLocation();
})();
