import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/Form.css";

/**
 * Function to handle form submission to get url and headers of website
 * @param {Function} onFormSubmit function to be called when the url form gets submitted to pass data to parent component
 * @returns jsx for the url submission form
 */
function Form({ onFormSubmit }) {
  // State to hold url for the website
  const [url, setUrl] = useState("");
  // State to hold list of headers for the website
  const [headers, setHeaders] = useState([]);
  // State to hold the key, value of the new header to be added to header list
  const [newHeader, setNewHeader] = useState({});
  // State to hold the device type on which the website needs to be tested
  const [deviceType, setDeviceType] = useState("mobile");

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
    onFormSubmit(url, headerObject, deviceType);
  }

  return (
    <div className="url-form">
      <div className="url-input">
        <select
          className="select-box"
          onChange={(e) => {
            setDeviceType(e.target.value);
          }}
        >
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
        </select>
        <input
          type="text"
          placeholder="Enter complete url e.g.('https://example.com')"
          onChange={(e) => setUrl(e.target.value)}
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
                value={newHeader.key}
                onChange={(e) => {
                  setNewHeader({
                    key: e.target.value,
                    value: newHeader.value,
                  });
                }}
                placeholder="Key"
                spellCheck="false"
              />
            </td>
            <td>
              <input
                type="text"
                value={newHeader.value}
                onChange={(e) => {
                  setNewHeader({
                    key: newHeader.key,
                    value: e.target.value,
                  });
                }}
                placeholder="Value"
                spellCheck="false"
              />
            </td>
            <td>
              <img
                src="add.png"
                alt="Add"
                onClick={() => {
                  setHeaders([...headers, { ...newHeader }]);
                  setNewHeader({ key: "", value: "" });
                }}
              />
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
