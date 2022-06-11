import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { REACT_APP_SERVER_URL } from "../config";
import { DataContext } from "../contexts/DataContext";
import "../styles/Home.css";
import Form from "../components/Form";

/**
 * Function to return JSX for Home page
 * @returns jsx for the form element Home
 */
export default function Home() {
  const dataContext = useContext(DataContext);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  async function onFormSubmit(url, headers) {
    console.log(headers);
    setFormSubmitted(true);
    setLoading(true);
    try {
      const result = await axios.get(REACT_APP_SERVER_URL, {
        method: "GET",
        params: {
          url,
          headers,
        },
      });
      setLoading(false);
      dataContext.setData({ type: "changeData", data: result.data });
      navigate("/bootup-time");
    } catch (error) {
      setError(true);
      console.log(error);
    }
  }

  return (
    <div className="container">
      {!formSubmitted && <Form onFormSubmit={onFormSubmit} />}
      {formSubmitted && loading && !error && <div className="loader"></div>}
      {formSubmitted && error && <h1>Error..</h1>}
    </div>
  );
}
