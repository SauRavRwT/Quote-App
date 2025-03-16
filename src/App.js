import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

const pageSize = 12;

function App() {
  const [allQuotes, setAllQuotes] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quoteOfTheDay, setQuoteOfTheDay] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [quote, setQuote] = useState("");
  const [quoteNumber, setQuoteNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const fetchAllQuotes = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/SauRavRwT/Thoughts/main/assets/Thoughts.txt"
        );
        if (!response.ok) throw new Error("Failed to fetch quotes");

        const text = await response.text();
        const fetchedQuotes = text
          .split("\n")
          .filter((quote) => quote.trim() !== "");
        setAllQuotes(fetchedQuotes);

        const today = new Date();
        const dayOfYear = Math.floor(
          (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
        );
        setQuoteOfTheDay(fetchedQuotes[dayOfYear % fetchedQuotes.length]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllQuotes();

    const timer = setTimeout(() => setShowPreloader(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    setQuotes(allQuotes.slice(startIndex, startIndex + pageSize));
  }, [allQuotes, currentPage]);

  const loadNextPage = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage((prevPage) =>
        prevPage * pageSize < allQuotes.length ? prevPage + 1 : 1
      );
      setIsLoading(false);
    }, 300);
  };

  const openModal = (quote, index) => {
    setQuote(quote);
    setQuoteNumber((currentPage - 1) * pageSize + index + 1);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      {showPreloader && (
        <div className="preloader">
          <h1>Quotes!</h1>
        </div>
      )}
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="display-3 fw-bold">Quotes!</h1>
        </div>
        <div className="container mb-5 d-flex justify-content-center align-items-center">
          <div className="quote-of-the-day rounded-4 border p-3">
            <p className="font-monospace">
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
            <h2 className="fw-bold text-center">
              Quote of the Day: #{allQuotes.indexOf(quoteOfTheDay) + 1}
            </h2>
            <p className="font-monospace text-center">"{quoteOfTheDay}"</p>
          </div>
        </div>
        <div
          className={`quotes-grid row g-4 ${
            isLoading ? "fade-out" : "fade-in"
          }`}
        >
          {quotes.map((q, index) => (
            <div className="col-md-4" key={index}>
              <div
                className="card h-100 shadow-sm"
                onClick={() => openModal(q, index)}
              >
                <div className="card-body d-flex align-items-center justify-content-center">
                  <p className="card-text text-center font-monospace">
                    <strong>
                      #{(currentPage - 1) * pageSize + index + 1}:
                    </strong>{" "}
                    "{q}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            aria-labelledby="quoteModalLabel"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fs-5 fw-bold" id="quoteModalLabel">
                    Quote #{quoteNumber}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div
                  className="modal-body font-monospace text-center"
                  id="quoteModalBody"
                >
                  {quote}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-dark rounded-pill px-4 py-2"
            id="nextButton"
            type="button"
            onClick={loadNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
