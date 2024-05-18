import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const pageSize = 12; // Number of quotes per page

function App() {
  const [quotes, setQuotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quote, setQuote] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchQuotesForPage(currentPage);
  }, [currentPage]);

  const fetchQuotesForPage = async (page) => {
    const response = await fetch('../public/assets/Thoughts.txt');
    const text = await response.text();
    const allQuotes = text.split('\n').filter((quote) => quote.trim() !== '');
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const quotesForPage = allQuotes.slice(startIndex, endIndex);

    if (quotesForPage.length === 0 && allQuotes.length > 0) {
      // Reset to the first page if no more quotes are left
      setCurrentPage(1);
      setQuotes(allQuotes.slice(0, pageSize));
    } else {
      setQuotes(quotesForPage);
    }
  };

  const loadNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
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
      <h1 className="mt-5 mb-4 display-3 fw-bold p-2 border-bottom text-center">Quote!</h1>
      <div className="row d-flex justify-content-center border-bottom" id="quoteGrid">
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
        <div className="modal show d-block" tabIndex="-1" aria-labelledby="quoteModalLabel">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-5 fw-bold" id="quoteModalLabel">Today's Quote</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body font-monospace text-center" id="quoteModalBody">
                {quote}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-center">
        <button className="btn rounded-3" id="nextButton" onClick={loadNextPage}>Next</button>
      </div>
    </div>
  );
}

export default App;
