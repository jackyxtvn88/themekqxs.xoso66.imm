import React, { useState } from 'react';
import styles from '../styles/global.css';

export default function Calendar({ selectedDate, onDateChange }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getDaysArray = () => {
    const days = [];
    const count = daysInMonth(currentMonth);
    for (let i = 1; i <= count; i++) {
      days.push(i);
    }
    return days;
  };

  return (
    <div className="CalendarWrapper">
      <div className="calendar">
        <div style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
          {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', padding: '10px' }}>
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
            <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>
              {day}
            </div>
          ))}
          {getDaysArray().map((day) => (
            <button
              key={day}
              onClick={() => onDateChange?.(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedDate?.getDate() === day ? '#ff6b6b' : '#f5f5f5',
                color: selectedDate?.getDate() === day ? 'white' : 'black'
              }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

