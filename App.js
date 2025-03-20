import React, { useState } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // Voice recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const startListening = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    setIsListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addExpenseFromVoice(transcript);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
  };

  const addExpenseFromVoice = (text) => {
    const amountMatch = text.match(/\d+/); // Extract first number as amount
    const amount = amountMatch ? `$${amountMatch[0]}` : "$0";
    const description = text.replace(amountMatch, "").trim() || "Unknown";
    const newExpense = `${amount} - ${description}`;
    setExpenses([...expenses, newExpense]);
  };

  return (
    <div className="App">
      <h1>Splitkaro Prototype</h1>
      <p>Easily add expenses with voice!</p>
      <button
        onClick={startListening}
        disabled={isListening}
        style={{ padding: '10px', fontSize: '16px' }}
      >
        {isListening ? "Listening..." : "Add Expense via Voice"}
      </button>
      <div style={{ marginTop: '20px' }}>
        <h2>Your Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul>
            {expenses.map((expense, index) => (
              <li key={index}>{expense}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;