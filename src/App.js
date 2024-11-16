// src/App.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons"; // Import the icon
import "./App.css";

function App() {
  const [amount, setAmount] = useState(1); // Amount to convert
  const [fromCurrency, setFromCurrency] = useState("USD"); // Currency to convert from
  const [toCurrency, setToCurrency] = useState("EUR"); // Currency to convert to
  const [exchangeRates, setExchangeRates] = useState({}); // Object to hold exchange rates
  const [convertedAmount, setConvertedAmount] = useState(null); // Result of conversion
  const [currencies, setCurrencies] = useState([]); // List of supported currencies

  // Fetch exchange rates from the API when the component mounts
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // Try v6 API first
        const responseV6 = await axios.get(
          "https://v6.exchangerate-api.com/v6/3894a85ef594bb2923db4fa4/latest/USD"
        );
        setExchangeRates(responseV6.data.conversion_rates);
        setCurrencies(Object.keys(responseV6.data.conversion_rates));
      } catch (error) {
        console.error("Error fetching from v6, trying v4...", error);

        // Fallback to v4 API if v6 fails
        try {
          const responseV4 = await axios.get(
            "https://api.exchangerate-api.com/v4/latest/USD"
          );
          setExchangeRates(responseV4.data.rates);
          setCurrencies(Object.keys(responseV4.data.rates));
        } catch (errorV4) {
          console.error("Error fetching from v4:", errorV4);
        }
      }
    };

    fetchExchangeRates();
  }, []);

  // Function to handle the currency conversion
  useEffect(() => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const rateFrom = exchangeRates[fromCurrency];
      const rateTo = exchangeRates[toCurrency];
      const result = (amount / rateFrom) * rateTo;
      setConvertedAmount(result.toFixed(2)); // Fix to 2 decimal places
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  // Toggle the currencies
  const toggleCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="App">
      <div className="converter-container">
        <h1>Currency Converter</h1>
        <div className="description">
          <p>
            Convert between different currencies with up-to-date exchange rates.
            Enter an amount, choose your currencies, and get the conversion!
          </p>
          <div className="info-tooltip">
            <FontAwesomeIcon icon={faInfoCircle} size="lg" />
            <span className="tooltip-text">
              Exchange rates are sourced live from Exchange Rate API.
            </span>
          </div>
        </div>

        <div className="currency-select-container">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="currency-select"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          <button className="switch-button" onClick={toggleCurrencies}>
            <FontAwesomeIcon icon={faSyncAlt} size="lg" />
          </button>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="currency-select"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          className="amount-input"
        />

        <div className="result">
          {convertedAmount !== null && (
            <p>
              {amount} {fromCurrency} is equal to {convertedAmount} {toCurrency}
            </p>
          )}
        </div>

        <div className="footer-note">
          <p>
            Note: The exchange rates provided are updated daily. Please check
            back daily for the most accurate rates.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
