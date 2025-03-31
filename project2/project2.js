const unsplashAccessKey = 'Kg0DB1l6KRyBW_amGoI4KoNuNjQ2NwpbNQsoPhQxRgk';

async function fetchTravelPhotos(destination) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${destination}&client_id=${unsplashAccessKey}`);
        const data = await response.json();
        return data.results[0] ? data.results[0].urls.regular : 'https://via.placeholder.com/300x200';
    } catch (error) {
        console.error("Error fetching photos:", error);
        return 'https://via.placeholder.com/300x200';
    }
}

async function fetchDestinationDetails(destination) {
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${destination}`);
        const data = await response.json();
        return {
            title: data.title,
            description: data.extract,
            url: data.content_urls.desktop.page
        };
    } catch (error) {
        console.error("Error fetching details:", error);
        return {
            title: destination,
            description: "No information available.",
            url: ""
        };
    }
}

async function loadDestinations() {
    const container = document.getElementById('destination-container');
    const destinations = ['Kyoto', 'Munich', 'Copenhagen', 'New York', 'Bangkok'];

    for (const destination of destinations) {
        const photoUrl = await fetchTravelPhotos(destination);
        const details = await fetchDestinationDetails(destination);

        const card = document.createElement('div');
        card.classList.add('destination-card');
        card.innerHTML = `
            <img src="${photoUrl}" alt="${destination}">
            <div class="destination-info">
                <h3>${details.title}</h3>
                <p>${details.description}</p>
                <a href="${details.url}" target="_blank">Learn more</a>
            </div>
        `;
        container.appendChild(card);
    }
}

if (document.getElementById('destination-container') && document.title === "Home - Oh The Places You'll Go") {
    loadDestinations();
}

async function handleSearch() {
    const city = document.getElementById('city-input').value;
    if (!city) return;

    const photoUrl = await fetchTravelPhotos(city);
    const details = await fetchDestinationDetails(city);

    const container = document.getElementById('destination-container');
    container.innerHTML = '';  

    const card = document.createElement('div');
    card.classList.add('destination-card');
    card.innerHTML = `
        <img src="${photoUrl}" alt="${city}">
        <div class="destination-info">
            <h3>${details.title}</h3>
            <p>${details.description}</p>
            <a href="${details.url}" target="_blank">Learn more</a>
        </div>
    `;
    container.appendChild(card);
}

if (document.getElementById('search-button') && document.title === "Search - Oh The Places You'll Go") {
    document.getElementById('search-button').addEventListener('click', handleSearch);
}