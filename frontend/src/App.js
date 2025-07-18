import React, { useEffect, useState } from "react";
import './App.css';

const API_BASE = "http://localhost:8000";

function App() {
  const [characters, setCharacters] = useState([]);
  const [showArcana, setShowArcana] = useState(false);
  const [expandedChar, setExpandedChar] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState(""); // NEW

  useEffect(() => {
    fetch(`${API_BASE}/characters`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load characters");
        return res.json();
      })
      .then(setCharacters)
      .catch((err) => {
        console.error(err);
        setError("Failed to load characters");
      });
  }, []);

  const handleCharacterClick = (charName) => {
    if (expandedChar === charName) {
      setExpandedChar(null);
      setAnswers([]);
      setError(null);
      return;
    }

    setExpandedChar(charName);
    setLoadingAnswers(true);
    setError(null);

    fetch(`${API_BASE}/answers?character=${encodeURIComponent(charName)}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("No answers found.");
          else throw new Error("Failed to fetch answers.");
        }
        return res.json();
      })
      .then((data) => {
        setAnswers(data);
        setLoadingAnswers(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingAnswers(false);
      });
  };

  const sortedCharacters = [...characters].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "arcana") {
      return a.arcana.localeCompare(b.arcana);
    }
    return 0; // default: no sorting
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>🎴 Persona 3 Social Links Guide</h1>
        <div className="header-controls">
          <button onClick={() => setShowArcana((prev) => !prev)}>
            {showArcana ? "Hide Arcana" : "Show Arcana"}
          </button>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="">Sort By</option>
            <option value="name">Name (A-Z)</option>
            <option value="arcana">Arcana (A-Z)</option>
          </select>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        {sortedCharacters.map(({ name, arcana, image_url }) => (
          <div
            key={name}
            className="character-card"
            onClick={() => handleCharacterClick(name)}
          >
            <img src={image_url} alt={name} draggable={false} />
            <div className="name">{name}</div>
            {showArcana && <div className="arcana">{arcana}</div>}
          </div>
        ))}
      </div>

      {expandedChar && (
        <div className="overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setExpandedChar(null)}>
              ✖
            </button>
            <h2>{expandedChar}</h2>
            {loadingAnswers && <p className="loading">Loading answers...</p>}
            {!loadingAnswers && answers.length === 0 && !error && (
              <p>No answers found.</p>
            )}
            {!loadingAnswers &&
              answers.map(({ Rank, Answer }, idx) => (
                <div key={idx} className="answer-block">
                  <strong>{Rank}</strong>
                  <p>
                    {Answer || (
                      <em>No specific response affects your relationship.</em>
                    )}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
