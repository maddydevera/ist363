import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import ConcertCalendar from './components/ConcertCalendar';
import JournalEntries from './components/JournalEntries';
import { Menu, X } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [savedConcerts, setSavedConcerts] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadedConcerts = JSON.parse(localStorage.getItem('savedConcerts')) || [];
    const loadedEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setSavedConcerts(loadedConcerts);
    setJournalEntries(loadedEntries);
  }, []);

  useEffect(() => {
    localStorage.setItem('savedConcerts', JSON.stringify(savedConcerts));
  }, [savedConcerts]);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const addConcert = (concert) => {
    if (!savedConcerts.some(c => c.id === concert.id)) {
      setSavedConcerts([...savedConcerts, concert]);
      return true;
    }
    return false;
  };

  const addJournalEntry = (entry) => {
    setJournalEntries([...journalEntries, entry]);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false); 
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-700 text-white p-4 relative">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Concert Log</h1>
          
          <div className="hidden md:flex space-x-4">
            <button 
              onClick={() => handleNavClick('home')}
              className={`hover:underline ${currentPage === 'home' ? 'underline font-semibold' : ''}`}
            >
              Find A Concert
            </button>
            <button 
              onClick={() => handleNavClick('calendar')}
              className={`hover:underline ${currentPage === 'calendar' ? 'underline font-semibold' : ''}`}
            >
              Concert Calendar
            </button>
            <button 
              onClick={() => handleNavClick('journal')}
              className={`hover:underline ${currentPage === 'journal' ? 'underline font-semibold' : ''}`}
            >
              Journal Entries
            </button>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-blue-700 z-50 shadow-lg">
            <div className="flex flex-col p-4 space-y-4">
              <button 
                onClick={() => handleNavClick('home')}
                className={`text-left hover:underline ${currentPage === 'home' ? 'underline font-semibold' : ''}`}
              >
                Find A Concert
              </button>
              <button 
                onClick={() => handleNavClick('calendar')}
                className={`text-left hover:underline ${currentPage === 'calendar' ? 'underline font-semibold' : ''}`}
              >
                Concert Calendar
              </button>
              <button 
                onClick={() => handleNavClick('journal')}
                className={`text-left hover:underline ${currentPage === 'journal' ? 'underline font-semibold' : ''}`}
              >
                Journal Entries
              </button>
            </div>
          </div>
        )}
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