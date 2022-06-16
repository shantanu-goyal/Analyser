import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/Form.css";

/**
 * Function to handle form submission to get url and headers of website
 * @param {Function} onFormSubmit function to be called when the url form gets submitted to pass data to parent component
 * @returns jsx for the url submission form
 */
function Form({ onFormSubmit }) {
  // State to hold list of headers for the website
  const [headers, setHeaders] = useState([]);

  // Reference to input field for the website url
  const urlRef = useRef(null);
  // Reference to key field for new header
  const keyRef = useRef(null);
  // Reference to value field for new header
  const valueRef = useRef(null);
  // Reference to device type selector
  const deviceRef = useRef(null);
  const waitTimeRef = useRef(null);

  /**
   * Handle the form submission
   * @param {object} event Object which holds form submit event data
   */
  function handleUrlSubmit(event) {
    event.preventDefault();
    // Covert header list into header object
    let headerObject = headers.reduce((obj, { key, value }) => {
      obj[key] = value;
      return obj;
    }, {});
    const url = urlRef.current.value;
    const deviceType = deviceRef.current.value;
    const waitTime = waitTimeRef.current.value;
    onFormSubmit(url, headerObject, deviceType, waitTime);
  }

  /**
   * Function to handle addition of new header to header list
   */
  function onHeaderAdd() {
    const key = keyRef.current.value;
    const value = valueRef.current.value;
    // Dont add header if key or value not present or if key already in header list
    if (!key || !value || headers.find((header) => header.key === key)) {
      alert("Invalid Entry");
      return;
    }
    // Add new header object to header list
    setHeaders([...headers, { key, value }]);
    // Clear the input box for next input header
    keyRef.current.value = "";
    valueRef.current.value = "";
  }

  return (
    <div className="url-form">
      <div className="url-input">
      <label for="device-input">Device Type</label>
        <select className="select-box" ref={deviceRef} id="device-input">
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
        </select>
        <label for="wait-input">Wait Time</label>
        <input
          type="number"
          id="wait-input"
          placeholder="Analysis Duration in ms"
          ref={waitTimeRef}
        />
        <label for="url-input">URL</label>
        <input
          type="text"
          id="url-input"
          placeholder="Enter complete url e.g.('https://example.com')"
          ref={urlRef}
        />
        <button onClick={handleUrlSubmit}>Submit</button>
      </div>

      <h1 className="header-text">Headers</h1>

      <table className="header-input">
        <thead>
          <tr>
            <th>KEY</th>
            <th>VALUE</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {headers.map(({ key, value }, index) => {
            return (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      setHeaders([
                        ...headers.slice(0, index),
                        { key: e.target.value, value },
                        ...headers.slice(index + 1),
                      ]);
                    }}
                    spellCheck="false"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      setHeaders([
                        ...headers.slice(0, index),
                        { key, value: e.target.value },
                        ...headers.slice(index + 1),
                      ]);
                    }}
                    spellCheck="false"
                  />
                </td>
                <td>
                  <img
                    src="remove.png"
                    alt="Remove"
                    onClick={() =>
                      setHeaders([
                        ...headers.slice(0, index),
                        ...headers.slice(index + 1),
                      ])
                    }
                  />
                </td>
              </tr>
            );
          })}

          <tr>
            <td>
              <input
                type="text"
                ref={keyRef}
                placeholder="Key"
                spellCheck="false"
              />
            </td>
            <td>
              <input
                type="text"
                ref={valueRef}
                placeholder="Value"
                spellCheck="false"
              />
            </td>
            <td>
              <img src="add.png" alt="Add" onClick={onHeaderAdd} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

Form.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};

export default Form;
