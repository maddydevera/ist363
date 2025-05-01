import React, { useState, useEffect } from 'react';

const JournalEntries = ({ journalEntries, savedConcerts, addJournalEntry }) => {
  const [formData, setFormData] = useState({
    artist: '',
    venue: '',
    date: '',
    rating: 5,
    review: ''
  });
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [artistImage, setArtistImage] = useState('');
  
  useEffect(() => {
    if (savedConcerts.length > 0 && !selectedConcert) {
      const firstConcert = savedConcerts[0];
      setSelectedConcert(firstConcert);
      setFormData({
        artist: firstConcert.artist,
        venue: firstConcert.venue,
        date: firstConcert.date,
        rating: 5,
        review: ''
      });
      
      fetchArtistImageFromWikipedia(firstConcert.artist);
    }
  }, [savedConcerts, selectedConcert]);
  
  const fetchArtistImageFromWikipedia = async (artistName) => {
    try {
      const searchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(artistName)}&origin=*`
      );
      const searchData = await searchResponse.json();
      
      if (searchData.query.search.length > 0) {
        const pageId = searchData.query.search[0].pageid;
        
        const imageResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&pageids=${pageId}&origin=*`
        );
        const imageData = await imageResponse.json();
        
        if (imageData.query.pages[pageId].original) {
          setArtistImage(imageData.query.pages[pageId].original.source);
        } else {
          setArtistImage(''); 
        }
      }
    } catch (error) {
      console.error('Error fetching Wikipedia image:', error);
      setArtistImage('');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleConcertSelect = (e) => {
    const concertId = e.target.value;
    const selected = savedConcerts.find(concert => concert.id === concertId);
    
    if (selected) {
      setSelectedConcert(selected);
      setFormData({
        artist: selected.artist,
        venue: selected.venue,
        date: selected.date,
        rating: 5,
        review: ''
      });
      
      fetchArtistImageFromWikipedia(selected.artist);
    }
  };
  
  const handleSubmit = () => {
    const newEntry = {
      id: Date.now().toString(),
      ...formData,
      artistImage: artistImage
    };
    
    addJournalEntry(newEntry);
    
    setFormData({
      artist: selectedConcert ? selectedConcert.artist : '',
      venue: selectedConcert ? selectedConcert.venue : '',
      date: selectedConcert ? selectedConcert.date : '',
      rating: 5,
      review: ''
    });
    
    alert('Journal entry saved successfully!');
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Journal Entries</h2>
      
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Entry</h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select Concert:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleConcertSelect}
            value={selectedConcert?.id || ''}
          >
            {savedConcerts.map(concert => (
              <option key={concert.id} value={concert.id}>
                {concert.artist} - {concert.venue} ({formatDate(concert.date)})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Artist:</label>
              <input
                type="text"
                name="artist"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.artist}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Venue:</label>
              <input
                type="text"
                name="venue"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.venue}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date:</label>
              <input
                type="date"
                name="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Rating:</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="text-2xl mr-1 focus:outline-none"
                  >
                    {star <= formData.rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Review:</label>
            <textarea
              name="review"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.review}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            Save Journal Entry
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Your Journal Entries</h3>
      
      {journalEntries.length === 0 ? (
        <p className="text-center text-gray-600 my-12">
          You haven't created any journal entries yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {journalEntries.map(entry => (
            <div key={entry.id} className="bg-white rounded shadow overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 bg-blue-600">
                  <img
                    src={entry.artistImage || '/api/placeholder/300/300'}
                    alt={entry.artist}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1">
                  <h4 className="text-xl font-semibold mb-2">{entry.artist}</h4>
                  <p className="text-gray-700 mb-1"><strong>Venue:</strong> {entry.venue}</p>
                  <p className="text-gray-700 mb-1">
                    <strong>Date:</strong> {formatDate(entry.date)}
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Rating:</strong> {Array(entry.rating).fill('★').join('')}
                    {Array(5 - entry.rating).fill('☆').join('')}
                  </p>
                  <p className="text-gray-800">{entry.review}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalEntries;