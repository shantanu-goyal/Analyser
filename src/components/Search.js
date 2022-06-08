import { useContext, useState } from "react";
import Form from "./Form"
import '../styles/Search.css'
import axios from "axios";
import { DataContext } from "../contexts/DataContext";
import { useNavigate } from "react-router-dom";



export default function Search() {
  const URL = process.env.REACT_APP_SERVER_URL;
  const dataContext = useContext(DataContext);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  async function onFormSubmit(url) {
    setFormSubmitted(true);
    setLoading(true);
    try {
      const result = await axios.get(URL, {
        method: "GET",
        params: {
          url
        }
      });
      setLoading(false);
      dataContext.setData({ type: "changeData", data: result.data });
      console.log(result.data);
      navigate('/bootup-time');
    } catch (error) {
      setError(true);
      console.log(error);
    }
  }



  return (
    <div className="container">
      {!formSubmitted && (<Form onFormSubmit={onFormSubmit} />)}
      {formSubmitted && loading && !error && (<h1>Loading...</h1>)}
      {formSubmitted && error && (<h1>Error..</h1>)}
    </div>
  )
}
