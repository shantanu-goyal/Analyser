import "../styles/Form.css";
import { useState } from "react";

function Form({ onFormSubmit }) {
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([]);
  const [newHeader, setNewHeader] = useState({});

  function handleUrlSubmit(e) {
    e.preventDefault();
    let headerObject = headers.reduce((obj, { key, value }) => {
      obj[key] = value;
      return obj;
    }, {});
    onFormSubmit(url, headerObject);
  }

  return (
    <div className="url-form">
      <div className="url-input">
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
                    spellcheck="false"
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
                    spellcheck="false"
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
                spellcheck="false"
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
                spellcheck="false"
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

export default Form;
