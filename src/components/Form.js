import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import "../styles/Form.css";
import Modal from "./Modal";
import { REACT_APP_SERVER_URL } from "../config";
import AuditHistory from "./AuditHistory";

/**
 * Function to handle form submission to get url and headers of website
 * @param {Function} onFormSubmit function to be called when the url form gets submitted to pass data to parent component
 * @returns jsx for the url submission form
 */
function Form({ onFormSubmit }) {
  const [flow, setFlow] = useState("navigation");
  const [suggestions, setSuggestions] = useState([]);

  // Reference to input field for the website url
  const urlRef = useRef(null);
  // Reference to device type selector
  const deviceRef = useRef(null);
  // Referencr to the waitime selector
  const waitTimeRef = useRef(null);
  const [prevAudits, setPrevAudits] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    async function gatherMetaData() {
      const result = await axios.get(`${REACT_APP_SERVER_URL}audits`);
      if (isSubscribed) {
        result.data = result.data.sort((a, b) => {
          return a.dateString < b.dateStrin ? 1 : -1;
        });
        setPrevAudits(result.data);
      }
      console.log(result.data);
    }
    gatherMetaData()
      // make sure to catch any error
      .catch(console.error);

    // cancel any future `setData`
    return () => (isSubscribed = false);
  }, []);

  /**
   * Handle the form submission
   * @param {object} event Object which holds form submit event data
   */
  function handleUrlSubmit(event) {
    event.preventDefault();
    // Covert header list into header object
    const url = urlRef.current.value;
    const deviceType = deviceRef.current.value;
    const waitTime = flow==="timespan" ? waitTimeRef.current.value : 0;
    onFormSubmit(url, deviceType, waitTime);
  }

  function prevAuditsClickHandler(index) {
    const { url, formFactor, waitTime, dateString } = prevAudits[index];
    onFormSubmit(url, formFactor, waitTime, dateString);
  }

  function updateSuggestions() {
    setSuggestions(
      [
        ...new Set(
          prevAudits
            .filter(({ url }) => url.indexOf(urlRef.current.value) !== -1)
            .map(({ url }) => url)
        ),
      ].slice(0, 5)
    );
  }

  return (
    <div className="home-page">
      <div className="website-title">
        <div className="title">Third Party Analyser</div>
        <div className="description">
          Analyse Impact of Third Party Scripts on Your Website
        </div>
      </div>
      <div className="form">
        <div className="form-header">
          <h1 className="form-title">Start a new analysis!</h1>
          <Modal name={"View Previous Analysis"}>
            <AuditHistory
              metaData={prevAudits}
              clickHandler={prevAuditsClickHandler}
            />
          </Modal>
        </div>
        <div className="form-autosuggest-container">
          <input
            className="form-text-input"
            type="text"
            id="url-input"
            placeholder="Enter a website URL..."
            ref={urlRef}
            onChange={() => {
              updateSuggestions();
            }}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <div className="form-autosuggest-content">
              {suggestions.map((url) => {
                return (
                  <p
                    className="form-autosuggest-element"
                    key={url}
                    onClick={(event) => {
                      urlRef.current.value = event.target.innerText;
                      updateSuggestions();
                    }}
                  >
                    {url}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        <div className="form-options">
          <div className="form-group">
            <label htmlFor="device-input">Device Type: </label>
            <select className="select-tag" ref={deviceRef} id="device-input">
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="flow-input">Analysis Type: </label>
            <select
              className="select-tag"
              id="device-input"
              onChange={(e) => {
                setFlow(e.target.value);
                if(e.target.value==="navigation"){
                  waitTimeRef.current.value=0;
                }
              }}
            >
              <option value="navigation">Navigation</option>
              <option value="timespan">Timespan</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="wait-input">Wait Time</label>
            <input
              disabled={flow==="navigation"}
              type="number"
              defaultValue={0}
              id="wait-input"
              placeholder="in seconds"
              ref={waitTimeRef}
            />
          </div>
          <Button
            height={"3em"}
            onClick={handleUrlSubmit}
          >
            Submit &#8594;
          </Button>
        </div>
      </div>
    </div>
  );
}

Form.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};

export default Form;
