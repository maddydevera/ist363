const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,precipitation,cloud_cover&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch';

async function fetchWeatherData() {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Could not fetch data');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.querySelector('.weather').innerHTML = '<h4>Error Fetching Data</h4>';
        console.error(error);
    }
}

function displayWeather(data) {
    if (!data || !data.current) {
        document.querySelector('.weather').innerHTML = '<h4>No Weather Data Available</h4>';
        return;
    }

    const { temperature_2m, precipitation, cloud_cover } = data.current;
    const cloudEmoji = cloud_cover > 50 ? '☁️' : '☀️';

    document.getElementById('precipitation').textContent = `${precipitation}"`;

    document.getElementById('temperature').textContent = `${temperature_2m}°F`;

    document.getElementById('weather-icon').textContent = cloudEmoji;
}

document.addEventListener("DOMContentLoaded", fetchWeatherData);
