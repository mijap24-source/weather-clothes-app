let outerLayerItems = [
    { name: "scarf", points: 1 },
    { name: "thin layer", points: 1 },
    { name: "coat", points: 2 },
    { name: "jacket", points: 3 }
];

let weatherDescription = {
    0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Foggy",
    51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    56: "Light freezing drizzle", 57: "Dense freezing drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain",
    66: "Light hail", 67: "Heavy hail",
    71: "Light snowfall", 72: "Snowfall", 73: "Heavy snowfall", 77: "Snow grains",
    80: "Light rain showers", 81: "Rain showers", 82: "Heavy rain showers",
    85: "Light snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with light hail", 99: "Thunderstorm with heavy hail"
};

// NEW: turns a weather code into a background category name
function getWeatherCategory(code) {
    if (code === 0 || code === 1) return "clear";
    if (code === 2 || code === 3) return "cloudy";
    if (code === 45 || code === 48) return "fog";
    if (code >= 51 && code <= 63 || code === 80 || code === 81) return "rain";
    if (code >= 65 && code <= 67 || code === 82) return "heavyrain";
    if (code === 71 || code === 77) return "snow";
    if (code === 72 || code === 73 || code === 85 || code === 86) return "heavysnow";
    if (code >= 95) return "storm";
    return "cloudy";
}

// NEW: builds the row of option dots and wires up clicking them
function renderOptionDots(base, comboSentencesArray) {
    let dotsContainer = document.getElementById("optionDots");
    dotsContainer.innerHTML = ""; // clear any old dots before rebuilding

    let totalStates = comboSentencesArray.length + 1; // +1 for the bare state (index 0)

    for (let i = 0; i < totalStates; i++) {
        let dot = document.createElement("button");
        dot.className = "option-dot";
        dot.textContent = i;
        dot.addEventListener("click", function () {
            setActiveState(i, base, comboSentencesArray);
        });
        dotsContainer.appendChild(dot);
    }

    setActiveState(1, base, comboSentencesArray); // default to first real outfit, not bare
}

// NEW: updates the text label and highlights the active dot
function setActiveState(index, base, comboSentencesArray) {
    let label = document.getElementById("stateLabel");

    if (index === 0) {
        label.textContent = "Bare";
    } else {
        let comboText = comboSentencesArray[index - 1];
        let outerPart = comboText === "" ? "no outer layer" : comboText;
        label.textContent = "Top: " + base.top + ", Bottom: " + base.bottom + " + " + outerPart;
    }

    let allDots = document.querySelectorAll(".option-dot");
    allDots.forEach(function (dot, dotIndex) {
        if (dotIndex === index) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

async function getWeather() {
    document.getElementById("loading").textContent = "Loading...";

    try {
        let response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=54.6872&longitude=25.2797&current=weather_code,temperature_2m,wind_speed_10m,cloud_cover,precipitation_probability");
        let data = await response.json();

        let temperature = data.current.temperature_2m;
        let windSpeed = data.current.wind_speed_10m;
        let cloudy = data.current.cloud_cover > 50;
        let rain = data.current.precipitation_probability;
        let weatherCode = data.current.weather_code;
        let weather = weatherDescription[weatherCode];

        let result = getOutfitRecommendation(temperature, cloudy, windSpeed);
        let comboNames = result.outerOptions.map(combo => combo.map(item => item.name));
        let comboSentencesArray = comboNames.map(combo => combo.join(" + "));

        let needUmbrella = getRain(rain);

        document.getElementById("weather").textContent = weather;
        document.getElementById("temp").textContent = Math.round(temperature) + "°";
        document.getElementById("wind").textContent = "Wind: " + windSpeed + " km/h";
        document.getElementById("rain").textContent = "Rain: " + rain + "%";

        // NEW: background category
        document.body.className = "bg-" + getWeatherCategory(weatherCode);

        // NEW: umbrella icon show/hide
        let umbrellaIcon = document.getElementById("umbrellaIcon");
        if (needUmbrella !== "") {
            umbrellaIcon.classList.remove("hidden");
        } else {
            umbrellaIcon.classList.add("hidden");
        }

        // NEW: build the option dots for this day's outfit
        renderOptionDots(result, comboSentencesArray);

        document.getElementById("loading").textContent = "";

    } catch (error) {
        document.getElementById("loading").textContent = "Couldn't load weather: " + error.message;
    }
}

function getBasePoints(temperature) {
    let tempValue = Math.round(temperature / 5) * 5;
    let steps = (10 - tempValue) / 5;
    let points = 5 + steps;
    return points;
}

function splitLayers(points) {
    let top = Math.min(3, Math.max(0, points - 2));
    let bottom = Math.min(3, Math.max(1, points - top));
    let leftover = Math.max(0, points - top - bottom);
    return { top: top, bottom: bottom, leftover: leftover };
}

function getExtraPoints(cloudy, windSpeed) {
    let cloudyPoints = cloudy ? 1 : 0;
    let windPoints = Math.round(windSpeed / 10);
    return { cloudyPoints: cloudyPoints, windPoints: windPoints };
}

function findCombos(items, target) {
    if (target === 0) {
        return [[]];
    }
    if (target < 0 || items.length === 0) {
        return [];
    }
    let firstItem = items[0];
    let remainingItems = items.slice(1);
    let comboSincluding = findCombos(remainingItems, target - firstItem.points);
    let withFirst = comboSincluding.map(combo => [firstItem, ...combo]);
    let withoutFirst = findCombos(remainingItems, target);
    return withFirst.concat(withoutFirst);
}

function getRain(rain) {
    if (rain > 50) {
        return "Bring an umbrella.";
    } else {
        return "";
    }
}

function getOutfitRecommendation(temperature, cloudy, windSpeed) {
    let basePoints = getBasePoints(temperature);
    let base = splitLayers(basePoints);
    let extras = getExtraPoints(cloudy, windSpeed);

    let outerTarget = base.leftover + extras.cloudyPoints + extras.windPoints;
    let outerOptions = findCombos(outerLayerItems, outerTarget);

    return {
        top: base.top,
        bottom: base.bottom,
        outerOptions: outerOptions
    };
}

getWeather();
setInterval(getWeather, 600000);