import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

const pageSize = 12;

function App() {
  const [allQuotes, setAllQuotes] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quote, setQuote] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllQuotes = async () => {
      const response = await fetch(
        "https://raw.githubusercontent.com/SauRavRwT/Thoughts/main/assets/Thoughts.txt"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quotes");
      }
      const text = await response.text();
      const fetchedQuotes = text
        .split("\n")
        .filter((quote) => quote.trim() !== "");
      setAllQuotes(fetchedQuotes);
    };

    fetchAllQuotes();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const quotesForPage = allQuotes.slice(startIndex, startIndex + pageSize);
    setQuotes(quotesForPage);
  }, [allQuotes, currentPage]);

  const loadNextPage = () => {
    if (currentPage * pageSize < allQuotes.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      setCurrentPage(1); // Loop back to the first page if no more quotes
    }
  };

  const openModal = (quote) => {
    setQuote(quote);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleBlur = () => {
      document.title = "Quote-App - Come back!";
    };
    const handleFocus = () => {
      document.title = "Quote-App!";
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="container">
      <h1 className="mt-5 mb-4 display-3 fw-bold p-2 border-bottom text-center">
        Quotes!
      </h1>
      <div
        className="row d-flex justify-content-center border-bottom"
        id="quoteGrid"
      >
        {quotes.map((q, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card rounded-4" onClick={() => openModal(q)}>
              <div className="card-body">
                <p className="card-text font-monospace">"{q}"</p>
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
                  Today's Quote
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

      <div className="d-flex justify-content-center">
        <button
          className="btn button btn-dark rounded-3"
          id="nextButton"
          type="button"
          onClick={loadNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
