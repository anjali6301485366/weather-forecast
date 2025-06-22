const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert("Please enter a city name.");

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // Fetch current weather
    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    // Fetch forecast
    const forecastRes = await fetch(forecastURL);
    const forecastData = await forecastRes.json();

    showCurrentWeather(weatherData);
    showForecast(forecastData);

  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("City not found. Please try again.");
  }
}

function showCurrentWeather(data) {
  const container = document.getElementById('currentWeather');
  container.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <div class="weather-info">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}">
      <div>
        <p class="temperature">${data.main.temp}°C</p>
        <p class="description">${data.weather[0].description}</p>
      </div>
    </div>
  `;
}

function showForecast(data) {
  const container = document.getElementById('forecast');
  container.innerHTML = `<h2>5-Day Forecast</h2>`;
  const forecastCards = document.createElement('div');
  forecastCards.className = 'forecast-cards';

  // Filter: pick one forecast per day (12:00 noon)
  const filtered = data.list.filter(f => f.dt_txt.includes("12:00:00"));

  filtered.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p>${dayName}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="">
      <p>${day.main.temp}°C</p>
    `;
    forecastCards.appendChild(card);
  });

  container.appendChild(forecastCards);
}
