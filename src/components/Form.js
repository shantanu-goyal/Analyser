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
    <>
    <div className="website-title"></div>
    <div className="url-form">
      
      <div className="url-input">
          <label htmlFor="device-input">Device Type: </label>
          <select className="select-box" ref={deviceRef} id="device-input">
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
          <small class="form-note">Select a device type on wchich we have to simulate analysis</small>

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
          <small class="form-note">Select navigate for page load analysis, use timespan to let analysis wait for some time for interaction</small>
        {flow === "timespan" && (
          <>
            <label htmlFor="wait-input">Wait Time</label>
            <input
              type="number"
              id="wait-input"
              placeholder="e.g. 10"
              ref={waitTimeRef}
            />
          </>
        )}

        <label htmlFor="url-input">URL</label>
        <input
          type="text"
          id="url-input"
          placeholder="e.g. https://example.com"
          ref={urlRef}
        />
        <button onClick={handleUrlSubmit}>Submit</button>
      </div>
      <small style={{float: 'right', fontSize: '0.25rem'}}><a href='https://www.freepik.com/vectors/data-flow'>Data flow vector created by starline - www.freepik.com</a></small>
    </div>
    </>
  );
}

Form.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};

export default Form;
