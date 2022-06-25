import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/Form.css";

/**
 * Function to handle form submission to get url and headers of website
 * @param {Function} onFormSubmit function to be called when the url form gets submitted to pass data to parent component
 * @returns jsx for the url submission form
 */
function Form({ onFormSubmit }) {
  const [flow, setFlow] = useState("navigation");

  // Reference to input field for the website url
  const urlRef = useRef(null);
  // Reference to device type selector
  const deviceRef = useRef(null);
  // Referencr to the waitime selector
  const waitTimeRef = useRef(null);

  /**
   * Handle the form submission
   * @param {object} event Object which holds form submit event data
   */
  function handleUrlSubmit(event) {
    event.preventDefault();
    // Covert header list into header object
    const url = urlRef.current.value;
    const deviceType = deviceRef.current.value;
    const waitTime = waitTimeRef.current ? waitTimeRef.current.value : 0;
    onFormSubmit(url, deviceType, waitTime);
  }

  return (
    <div className="home-page">
      <div className="website-title">
        <div className="title">Third Party Analyser</div>
        <div className="description">Analyse Impact of Third Party Scripts on Your Website</div>
      </div>
      <div className="form">
        <h1 className="form-title">Start a new analysis!</h1>
        <input
          className="form-text-input"
          type="text"
          id="url-input"
          placeholder="Enter a website URL..."
          ref={urlRef}
        />
        <div className="form-options">
          <div className="form-group">
          <label htmlFor="device-input">Device Type: </label>
          <select ref={deviceRef} id="device-input">
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
          </div>
          <div className="form-group">
          <label htmlFor="flow-input">Analysis Type: </label>
          <select
            className="select-box"
            id="device-input"
            onChange={(e) => {
              setFlow(e.target.value);
            }}
          >
            <option value="navigation">Navigation</option>
            <option value="timespan">Timespan</option>
          </select>
          </div>
          {flow === "timespan" && (
            <div className="form-group">
              <label htmlFor="wait-input">Wait Time</label>
              <input
                type="number"
                id="wait-input"
                placeholder="in seconds"
                ref={waitTimeRef}
              />
            </div>
          )}
           <button onClick={handleUrlSubmit}>Submit &#8594;</button>
        </div>
      </div>
    </div>
  );
}

Form.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};

export default Form;
