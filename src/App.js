// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import CurrentTimeDisplay from './components/CurrentTimeDisplay';
import DateTimePicker from './components/DateTimePicker';
import Countdown from './components/Countdown';
import TodoList from './components/TodoList/TodoList';

function App() {
  /********************************
   * 1) DEFAULT DATE/TIME
   ********************************/
  const [eventDateTime, setEventDateTime] = useState('');
  const [countdownText, setCountdownText] = useState('');
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const next420 = getNext420();
    setEventDateTime(toLocalIsoString(next420));
    startCountdown(next420);
    // Cleanup on unmount
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
    // eslint-disable-next-line
  }, []);

  function getNext420() {
    const now = new Date();
    const today420 = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      16, // 4 PM
      20, // :20
      0,
      0
    );
    if (now.getTime() < today420.getTime()) {
      return today420;
    } else {
      // Else tomorrow
      const tomorrow420 = new Date(today420);
      tomorrow420.setDate(today420.getDate() + 1);
      return tomorrow420;
    }
  }

  function toLocalIsoString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /********************************
   * 2) COUNTDOWN LOGIC
   ********************************/
  const handleUpdateCountdown = () => {
    if (!eventDateTime) {
      setCountdownText('Please select a valid date/time.');
      return;
    }

    const [datePart, timePart] = eventDateTime.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);

    const targetDate = new Date(year, month - 1, day, hour, minute);
    if (targetDate <= new Date()) {
      setCountdownText('Please select a future date/time.');
      return;
    }
    startCountdown(targetDate);
  };

  function startCountdown(targetDate) {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setCountdownText('Event Started!');
        clearInterval(countdownIntervalRef.current);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdownText(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
  }

  /********************************
   * 3) RENDERING THE DOM
   ********************************/
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div
        className="
          mx-auto 
          mt-10 
          w-full md:w-fit
          p-6 
          bg-white 
          rounded-lg 
          shadow-lg
        "
      >
        {/* (1) Current Time Display */}
        <CurrentTimeDisplay />

        {/* (2) Date/Time Picker + Update Button */}
        <DateTimePicker
          eventDateTime={eventDateTime}
          setEventDateTime={setEventDateTime}
          onUpdate={handleUpdateCountdown}
        />

        {/* (3) Countdown Title & Display */}
        <Countdown countdownText={countdownText} />

        {/* (4) Progress Bar & Summary, and To-Do List */}
        <TodoList />
      </div>
    </div>
  );
}

export default App;
