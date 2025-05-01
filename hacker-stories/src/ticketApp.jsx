import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import ConcertCalendar from './components/ConcertCalendar';
import JournalEntries from './components/JournalEntries';

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [savedConcerts, setSavedConcerts] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);

  useEffect(() => {
    // Load saved concerts and journal entries from localStorage on component mount
    const loadedConcerts = JSON.parse(localStorage.getItem('savedConcerts')) || [];
    const loadedEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setSavedConcerts(loadedConcerts);
    setJournalEntries(loadedEntries);
  }, []);

  // Update localStorage when savedConcerts changes
  useEffect(() => {
    localStorage.setItem('savedConcerts', JSON.stringify(savedConcerts));
  }, [savedConcerts]);

  // Update localStorage when journalEntries changes
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Add a concert to savedConcerts
  const addConcert = (concert) => {
    if (!savedConcerts.some(c => c.id === concert.id)) {
      setSavedConcerts([...savedConcerts, concert]);
      return true;
    }
    return false;
  };

  // Add a journal entry
  const addJournalEntry = (entry) => {
    setJournalEntries([...journalEntries, entry]);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Concert Log</h1>
          <div className="space-x-4">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`hover:underline ${currentPage === 'home' ? 'underline font-semibold' : ''}`}
            >
              Find A Concert
            </button>
            <button 
              onClick={() => setCurrentPage('calendar')}
              className={`hover:underline ${currentPage === 'calendar' ? 'underline font-semibold' : ''}`}
            >
              Concert Calendar
            </button>
            <button 
              onClick={() => setCurrentPage('journal')}
              className={`hover:underline ${currentPage === 'journal' ? 'underline font-semibold' : ''}`}
            >
              Journal Entries
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto p-4">
        {currentPage === 'home' && (
          <Home addConcert={addConcert} />
        )}
        {currentPage === 'calendar' && (
          <ConcertCalendar 
            savedConcerts={savedConcerts} 
            setCurrentPage={setCurrentPage} 
          />
        )}
        {currentPage === 'journal' && (
          <JournalEntries 
            journalEntries={journalEntries} 
            savedConcerts={savedConcerts} 
            addJournalEntry={addJournalEntry} 
          />
        )}
      </div>
    </div>
  );
};

export default App;