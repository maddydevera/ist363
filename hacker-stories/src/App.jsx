import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const pioneersData = [
  {
    id: 1,
    name: "Elizabeth J. Feinler",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Elizabeth_J._Feinler_2010.jpg",
    age: 92,
    knownFor: "Director of the Network Information Systems Center at SRI, helped manage ARPANET directory services.",
    viewed: false,
  },
  {
    id: 2,
    name: "Tim Berners Lee",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Tim_Berners-Lee_%28cropped%29.jpg",
    age: 69,
    knownFor: "Inventor of the World Wide Web, the HTML markup language, the URL system, and HTTP.",
    viewed: false,
  },
  {
    id: 3,
    name: "Ray Tomlinson",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/41/Ray_Tomlinson_2014.jpg",
    age: 74,
    knownFor: "Implemented the first email program on the ARPANET system, the precursor to the Internet.",
    viewed: false,
  },
];

function Pioneer({ pioneer, onBack }) {
  return (
    <div className="pioneer-details">
      <h2>{pioneer.name}</h2>
      <img src={pioneer.image} alt={pioneer.name} />
      <p><strong>Age:</strong> {pioneer.age}</p>
      <p><strong>Known For:</strong> {pioneer.knownFor}</p>
      <button onClick={onBack}>Return to Directory</button>
    </div>
  );
}

function App() {
  const [pioneers, setPioneers] = useState(pioneersData);
  const [selectedPioneer, setSelectedPioneer] = useState(null);

  const handleSelect = (id) => {
    const updated = pioneers.map((p) => p.id === id ? { ...p, viewed: true } : p);
    setPioneers(updated);
    setSelectedPioneer(updated.find((p) => p.id === id));
  };

  const goBack = () => setSelectedPioneer(null);

  if (selectedPioneer) {
    return <Pioneer pioneer={selectedPioneer} onBack={goBack} />;
  }

  return (
    <div>
      <h1>Internet Pioneers Bios</h1>
      <div className="grid">
        {pioneers.map((pioneer) => (
          <div className="card" key={pioneer.id} onClick={() => handleSelect(pioneer.id)}>
            <div style={{ position: "relative" }}>
              {pioneer.viewed && <div className="viewed-tag">VIEWED</div>}
              <img src={pioneer.image} alt={pioneer.name} />
            </div>
            <h3>{pioneer.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
