import React, { useState } from 'react';

const Home = ({ addConcert }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('artist'); 
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = 't4JINbEvueAlp7iEOUrjGUQgL2PzLbch';

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError(null);

    try {
      let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=20`;
      
      if (searchType === 'artist') {
        url += `&keyword=${encodeURIComponent(searchTerm)}`;
      } else if (searchType === 'venue') {
        url += `&venueId=${encodeURIComponent(searchTerm)}`;
      } else if (searchType === 'date') {
        url += `&startDateTime=${encodeURIComponent(searchTerm)}T00:00:00Z`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data._embedded && data._embedded.events) {
        setSearchResults(data._embedded.events);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError('Failed to fetch concert data. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = (event) => {
    const newConcert = {
      id: event.id,
      title: event.name,
      artist: event.name,
      venue: event._embedded?.venues?.[0]?.name || 'Unknown Venue',
      date: event.dates.start.localDate,
      time: event.dates.start.localTime || '',
      url: event.url,
      image: event.images?.[0]?.url || ''
    };
    
    const added = addConcert(newConcert);
    if (added) {
      alert(`Added "${event.name}" to your concert calendar!`);
    } else {
      alert('This concert is already in your calendar!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Find A Concert</h2>
      
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Search by:</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="artist">Artist</option>
              <option value="venue">Venue</option>
              <option value="date">Date</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {searchType === 'artist' ? 'Artist Name' : 
               searchType === 'venue' ? 'Venue Name' : 'Date (YYYY-MM-DD)'}:
            </label>
            <input 
              type={searchType === 'date' ? 'date' : 'text'}
              className="w-full p-2 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                searchType === 'artist' ? 'Enter artist name' : 
                searchType === 'venue' ? 'Enter venue name' : 'Select date'
              }
            />
          </div>
          
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition w-full md:w-auto self-start"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {searchResults.map(event => (
          <div key={event.id} className="border rounded overflow-hidden shadow-md bg-white">
            {event.images && event.images[0] && (
              <img 
                src={event.images[0].url} 
                alt={event.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
              <p className="text-gray-700 mb-1">
                <strong>Venue:</strong> {event._embedded?.venues?.[0]?.name || 'Unknown Venue'}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Date:</strong> {event.dates.start.localDate}
                {event.dates.start.localTime && ` at ${event.dates.start.localTime}`}
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
                <a 
                  href={event.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-center sm:text-left"
                >
                  View Details
                </a>
                <button
                  onClick={() => handleAddToCalendar(event)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition w-full sm:w-auto"
                >
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {searchResults.length === 0 && !loading && (
        <p className="text-center text-gray-600 my-12">
          {searchTerm ? 'No concerts found. Try a different search.' : 'Search for concerts to see results.'}
        </p>
      )}
    </div>
  );
};

export default Home;