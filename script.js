// GENERAL NOTES
// [] - array. array stores a list of things
// {} - object. objects store information about one thing
// === equal, <= less than or equal, > greater than, >= greater than or equal, != not equal
// && - and, || - or
// ? a : b - shorthand for if a is true, return a, otherwise return b
// . - used to access properties of an object (e.g. object.property)
// => - shorthand for function (e.g. (parameter) => { code })
// i - index of an array, used in loops to keep track of which item in the array is being looked at
// i++ - increment the index of an array by 1 (e.g. i++ means i = i + 1)

// let (name) - creating a variable that can be reassigned
// function name(parameter) - a block of code that can be called to do something (needs a return)
// querySelector(...) - finds an element in the webpage
// querySelectorAll(...) - finds all elements in the webpage that match a selector
// getElementById(...) - finds an element in the webpage by its id
// for - loops through a block of code a number of times
// addEventListener(...) - listens for an event on an element and runs a function when that event happens
// addAppend(...) - adds an element to the end of another element
// addAppendChild(...) - adds an element to the end of another element
// join - joins the elements of an array into a string, with a specified separator between each element
// async - allows a function to run asynchronously, meaning it can run in the background without blocking other code from running
// try - runs a block of code and catches any errors that occur
// catch - runs a block of code if an error occurs in the try block
// await - waits for a promise to resolve before continuing to the next line of code
// findCombos(...) - a function that finds all combinations of items that add up to a target value

// document. - the webpage itself
// textContent - gets or sets the text content of an element
// className - gets or sets the class name of an element
// body - the body of the webpage (html)
// hidden - a class that hides an element (css)
// math - a built-in object that provides mathematical functions and constants
// math.min (a, b) - returns the smaller of two numbers (e.g. math.min(1, 2) returns 1)
// length - a property that returns the number of elements in an array or the number of characters in a string
// map - a method that creates a new array by applying a function to each element of an existing array
// concat - a method that combines two or more arrays into a new array
// innerHTML - gets or sets the HTML content of an element
// forEach - a method that executes a provided function once for each array element
// classList - a property that returns the class names of an element as a DOMTokenList object
// domtokenlist - an object that represents a list of class names for an element
// class - a property that gets or sets the class name of an element




let outerLayerItems = [
    { name: "scarf", points: 1 }, // "name" and "points" are dfined so you can look it up later (e.g. firstItem.points).
    { name: "thin layer", points: 1 },
    { name: "coat", points: 2 },
    { name: "jacket", points: 3 }
];

let outerLayerImageIds = {
    "scarf": "outerScarfImg", // the name of an object + the html id for the image
    "thin layer": "outerThinLayerImg",
    "coat": "outerCoatImg",
    "jacket": "outerJacketImg"
};

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

function getWeatherCategory(code) {
    if (code >= 0 && code <= 2) return "clear";
    if (code === 3) return "cloudy";
    if (code === 45 || code === 48) return "fog";
    if (code >= 51 && code <= 63 || code === 80 || code === 81) return "rain";
    if (code >= 65 && code <= 67 || code === 82) return "heavy-rain";
    if (code === 71 || code === 77) return "snow";
    if (code === 72 || code === 73 || code === 85 || code === 86) return "heavy-snow";
    if (code >= 95) return "storm";
    return "cloudy";
}

function renderBaseLayer() { // function to render the base layer image
    document.querySelectorAll(".base-img").forEach(img => img.classList.add("hidden")); // hide all base layer images
    document.getElementById("baseImg").classList.remove("hidden"); // show the base layer image
}

function renderTopLayer(topValue) { // funciton to render the appropiate image for the top (shirt) layer
    document.querySelectorAll(".top-img").forEach(img => img.classList.add("hidden")); // hide all top layer images
    document.getElementById("top" + topValue + "Img").classList.remove("hidden"); // show the top layer image that corresponds to the topValue
}

function renderBottomLayer(bottomValue) {
    document.querySelectorAll(".bottom-img").forEach(img => img.classList.add("hidden")); // hide all bottom layer images
    document.getElementById("bottom" + bottomValue + "Img").classList.remove("hidden"); // show the bottom layer image that corresponds to the bottomValue
}

function renderOuterLayers(itemNamesArray) {
    document.querySelectorAll(".outer-img").forEach(img => img.classList.add("hidden")); // hide all outer layer images

    itemNamesArray.forEach(function (name) { // for each outer layer item name in the array, show the corresponding image
        let imageId = outerLayerImageIds[name]; // get the image id for the outer layer item name
        document.getElementById(imageId).classList.remove("hidden"); // show the image for the outer layer item name
    });
}

function renderUmbrella(needUmbrella) {
    let umbrella = document.getElementById("umbrella-img");
    if (needUmbrella) {
        umbrella.classList.remove("hidden");
    } else {
        umbrella.classList.add("hidden");
    }
}

function setActiveState(index, base, comboNames) { // set the active state to the index of the dot button that was clicked
    let label = document.getElementById("stateLabel");

    if (index === 0) { // if the index is 0...
        label.textContent = "Bare"; // set the label to "Bare" (no outer layer)
        renderOuterLayers([]); // no outer items at all in the bare state
    } else {
        let itemNamesArray = comboNames[index - 1]; // get the array of outer layer item names for the state that corresponds to the index of the dot button that was clicked (it is -1 because the array counts from 0 and the first state is bare, which is not in the array)
        let outerPart = itemNamesArray.length === 0 ? "no outer layer" : itemNamesArray.join(" + "); // if the array of outer layer item names is empty, set the outerPart to "no outer layer", otherwise join the array of outer layer item names with " + " in between each name
        label.textContent = "Top: " + base.top + ", Bottom: " + base.bottom + " + " + outerPart; // builds the text (not sure if needed)
        renderOuterLayers(itemNamesArray); // show the outer layer images for the state that corresponds to the index of the dot button that was clicked
    }

    document.querySelectorAll(".option-dot").forEach(function (dot, dotIndex) { // for each dot button, check if the index of the dot button is equal to the index of the state that was clicked
        if (dotIndex === index) { // is this the dot we are currently using?
            dot.classList.add("active"); // if it is, add the "active" class to the dot button (css)
        } else {
            dot.classList.remove("active"); // if it is not, remove the "active" class from the dot button (css)
        }
    });
}

function renderOptionDots(base, comboNames) { 
    let dotsContainer = document.getElementById("optionDots"); // get the container for the option dots
    dotsContainer.innerHTML = ""; // clear the container for the option dots so they don't pile up when the weather is updated

    if (comboNames.length === 1 && comboNames[0].length === 0) {
    comboNames = [];
    }

    let totalStates = comboNames.length + 1; // how many states there are (bare + number of outer layer combinations)

    for (let i = 0; i < totalStates; i++) { // for each state, create a dot button
        let dot = document.createElement("button"); // create a button element for the dot
        dot.className = "option-dot"; // set the class name (css) for the dot button
        dot.addEventListener("click", function () { // add a click event listener to the dot button
            setActiveState(i, base, comboNames); // when the dot button is clicked, set the active state to the index of the dot button
        });
        dotsContainer.appendChild(dot); // add the dot button to the container for the option dots
    }

    setActiveState(0, base, comboNames); // set the active state to the first state (bare) when the option dots are rendered
}

function getBasePoints(temperature) {
    let tempValue = Math.round(temperature / 5) * 5;
    let steps = (10 - tempValue) / 5;
    let points = 5 + steps;
    return points; // give the number to whatever calls the function
}

function splitLayers(points) {
    let top = Math.min(3, Math.max(0, points - 2));
    let bottom = Math.min(3, Math.max(1, points - top));
    let leftover = Math.max(0, points - top - bottom);
    return { top: top, bottom: bottom, leftover: leftover }; // give the number to whatever calls the function
}

function getExtraPoints(cloudy, windSpeed) {
    let cloudyPoints = cloudy ? 1 : 0;
    let windPoints = Math.round(windSpeed / 10);
    return { cloudyPoints: cloudyPoints, windPoints: windPoints }; // give the numbers to whatever calls the function
}

function findCombos(items, target) {
    if (target === 0) {
        return [[]]; // return an array with an empty array inside, representing one valid combination (no items)
    }
    if (target < 0 || items.length === 0) {
        return []; // no valid combinations found
    }
    let firstItem = items[0]; // get the first item in the array of items
    let remainingItems = items.slice(1); // create a new array with all items except the first one
    let comboSincluding = findCombos(remainingItems, target - firstItem.points); // find all combinations of the remaining items that add up to the target minus the points of the first item
    let withFirst = comboSincluding // add the first item to each combination of the remaining items that add up to the target minus the points of the first item
    .filter(combo => {
        return !(
            (firstItem.name === "coat" && combo.some(item => item.name === "jacket")) ||
            (firstItem.name === "jacket" && combo.some(item => item.name === "coat"))
        );
    })
    .map(combo => [firstItem, ...combo]);
    let withoutFirst = findCombos(remainingItems, target); // find all combinations of the remaining items that add up to the target without including the first item
    return withFirst.concat(withoutFirst); // combine the combinations that include the first item with the combinations that don't include the first item and return the result
}

function getRain(rain) {
    if (rain > 40) {
        return "Bring an umbrella.";
    } else {
        return "";
    }
}

function getOutfitRecommendation(temperature, cloudy, windSpeed) {
    let basePoints = getBasePoints(temperature); // get the base points based on the temperature
    let base = splitLayers(basePoints); // split the base points into top, bottom, and leftover points
    let extras = getExtraPoints(cloudy, windSpeed); // get the extra points based on the cloudy and windSpeed values

    let outerTarget;
        if (temperature < 25) {outerTarget = base.leftover + extras.cloudyPoints + extras.windPoints}
        else {outerTarget = 0};
    let outerOptions = findCombos(outerLayerItems, outerTarget); // find all combinations of outer layer items that add up to the outerTarget points

    return {
        top: base.top,
        bottom: base.bottom,
        outerOptions: outerOptions
    };
}

async function getWeather() {
    document.getElementById("loading").textContent = "Loading..."; // show the loading text while the weather is being fetched
    document.body.className = "bg-loading"; // set the class name of the body element to "bg-loading" (css) while the weather is being fetched

    try {
        let coords = await new Promise((resolve, reject) => {
       navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        resolve({ lat, lon });
        }, reject);
        });

        let response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + coords.lat + "&longitude=" + coords.lon + "&current=weather_code,temperature_2m,wind_speed_10m,cloud_cover,precipitation_probability,uv_index");
        let data = await response.json();

        let geoResponse = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + coords.lat + "&longitude=" + coords.lon + "&localityLanguage=en");
        let geoData = await geoResponse.json();
        let placeName = geoData.city || geoData.locality;

        let temperature = data.current.temperature_2m;
        let windSpeed = data.current.wind_speed_10m;
        let cloudy = data.current.cloud_cover > 50;
        let rain = data.current.precipitation_probability;
        let uvIndex = data.current.uv_index;
        let weatherCode = data.current.weather_code;
        let weather = weatherDescription[weatherCode]; // get the weather description for the weather code from the weatherDescription object

        let result = getOutfitRecommendation(temperature, cloudy, windSpeed); // get the outfit recommendation based on the weather data
        let comboNames = result.outerOptions.map(combo => combo.map(item => item.name)); // get the names of the outer layer items for each combination of outer layer items

        let needUmbrella = getRain(rain); // get the umbrella recommendation based on the rain probability

        document.getElementById("location").textContent = placeName;
        document.getElementById("weather").textContent = weather; // set the text content of the weather element to the weather description
        document.getElementById("temp").textContent = Math.round(temperature) + "°"; // set the text content of the temperature element to the rounded temperature with a degree symbol
        document.getElementById("wind").textContent = "Wind: " + windSpeed + " km/h"; // set the text content of the wind element to the wind speed with "Wind: " in front
        document.getElementById("rain").textContent = "Rain: " + rain + "%"; // set the text content of the rain element to the rain probability with "Rain: " in front
        document.getElementById("uvIndex").textContent = "UV Index: " + uvIndex; // set the text content of the UV index element to the UV index with "UV Index: " in front
        document.body.className = "bg-" + getWeatherCategory(weatherCode); // set the class name of the body element to "bg-" + the weather category for the weather code, which will change the background color of the app based on the weather

        renderUmbrella(needUmbrella); // render the umbrella image based on the umbrella recommendation
        renderTopLayer(result.top); // render the top layer image based on the top value from the outfit recommendation
        renderBottomLayer(result.bottom); // render the bottom layer image based on the bottom value from the outfit recommendation
        renderOptionDots(result, comboNames); // render the option dots based on the outfit recommendation and the names of the outer layer items for each combination of outer layer items
        renderBaseLayer();

        document.getElementById("loading").textContent = ""; // clear the loading text after the weather is loaded

    } catch (error) { // if there is an error fetching the weather data, show an error message  
        document.getElementById("loading").textContent = "Couldn't load weather: " + error.message;
    }
}

getWeather(); // call the getWeather function to fetch the weather data and render the outfit recommendation when the page loads
setInterval(getWeather, 600000);