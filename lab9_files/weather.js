function reportResults(responseText) {
    let weatherHTML = '';

    if (responseText !== 'error') {
        const data = JSON.parse(responseText); 
        const { temperature_2m, precipitation, cloud_cover } = data.current;
        const cloudEmoji = cloud_cover > 50 ? '☁️' : '☀️';

        weatherHTML = `
            Precipitation: ${precipitation}"<br>
            Temperature: ${temperature_2m}°F
        `;

        document.getElementById('precipitation').innerHTML = `${precipitation}"`;
        document.getElementById('temperature').innerHTML = `${temperature_2m}°F`;
        document.getElementById('weather-icon').textContent = cloudEmoji;
    } else {
        weatherHTML = '<h4>Error Fetching Data</h4>';
    }

    document.querySelector('.weather .row .col-md-6').innerHTML = weatherHTML;
}

const request = new XMLHttpRequest();
const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,precipitation,cloud_cover&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch';

request.addEventListener('readystatechange', () => {
    if (request.readyState === 4 && request.status === 200) {
        reportResults(request.responseText); 
    } else if (request.readyState === 4) {
        reportResults('error'); 
    }
});

request.open('GET', endpoint);
request.send();
