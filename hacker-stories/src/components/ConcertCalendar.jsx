import React, { useState } from 'react';

const ConcertCalendar = ({ savedConcerts, setCurrentPage }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const getConcertsForDate = (date) => {
    const formattedDate = formatDate(date);
    return savedConcerts.filter(concert => formatDate(concert.date) === formattedDate);
  };
  
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = getFirstDayOfMonth(month, year);
    
    const blankDays = Array(firstDayOfMonth).fill(null);
    
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    
    return [...blankDays, ...monthDays];
  };
  
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentMonth(new Date());
  };
  
  const handleDateHover = (date) => {
    if (date) {
      setHoveredDate(date);
    } else {
      setHoveredDate(null);
    }
  };
  
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  
  const calendarDays = generateCalendarDays();
  
  const selectedDateConcerts = selectedDate ? getConcertsForDate(selectedDate) : [];
  const hoveredDateConcerts = hoveredDate ? getConcertsForDate(hoveredDate) : [];
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Concert Calendar</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <button
                onClick={prevMonth}
                className="p-2 rounded hover:bg-gray-200"
              >
                &lt;
              </button>
              <h3 className="text-xl font-semibold px-2">{formatMonthYear(currentMonth)}</h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded hover:bg-gray-200"
              >
                &gt;
              </button>
              <button
                onClick={goToToday}
                className="ml-auto mt-2 sm:mt-0 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Today
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold p-1 text-xs sm:text-sm md:p-2">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`blank-${index}`} className="p-1 sm:p-2"></div>;
                }
                
                const isToday = formatDate(day) === formatDate(new Date());
                const hasConcert = getConcertsForDate(day).length > 0;
                const isSelected = selectedDate && formatDate(day) === formatDate(selectedDate);
                
                return (
                  <div 
                    key={day.toString()}
                    className={`relative p-1 sm:p-2 text-center border h-10 sm:h-14 cursor-pointer ${
                      isToday ? 'bg-blue-100' : ''
                    } ${
                      isSelected ? 'bg-blue-200' : ''
                    }`}
                    onMouseEnter={() => handleDateHover(day)}
                    onMouseLeave={() => handleDateHover(null)}
                    onClick={() => handleDateClick(day)}
                  >
                    <span className="text-xs sm:text-base">{day.getDate()}</span>
                    
                    {hasConcert && (
                      <div 
                        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full"
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow order-1 lg:order-2 mb-6 lg:mb-0">
          {selectedDate ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Concerts on {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              
              {selectedDateConcerts.length > 0 ? (
                selectedDateConcerts.map(concert => (
                  <div key={concert.id} className="mb-4 pb-4 border-b">
                    {concert.image && (
                      <img 
                        src={concert.image} 
                        alt={concert.title}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <p className="font-semibold">{concert.title}</p>
                    <p className="text-sm text-gray-600">{concert.venue}</p>
                    {concert.time && <p className="text-sm text-gray-600">Time: {concert.time}</p>}
                    <div className="mt-2">
                      <a 
                        href={concert.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Ticket Info
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No concerts scheduled for this date.
                </p>
              )}
              
              <button
                onClick={() => setCurrentPage('journal')}
                className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
              >
                Add Journal Entry
              </button>
            </div>
          ) : hoveredDate && hoveredDateConcerts.length > 0 ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Concerts on {hoveredDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              
              {hoveredDateConcerts.map(concert => (
                <div key={concert.id} className="mb-2">
                  <p className="font-semibold">{concert.title}</p>
                  <p className="text-sm text-gray-600">{concert.venue}</p>
                </div>
              ))}
              
              <p className="text-sm text-gray-500 mt-4">
                Click on the date to see more details.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Select a date from the calendar to view concerts.</p>
              <p className="mt-4 text-sm">
                Dates with concerts are marked with a blue dot.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConcertCalendar;