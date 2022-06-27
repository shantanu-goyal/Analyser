import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import ThemeButton from "../components/ThemeButton";
import { REACT_APP_SERVER_URL } from "../config";
import { DataContext } from "../contexts/DataContext";
import "../styles/Home.css";
import { transformData } from "../utility/thirdPartyUtility";
/**
 * Function to return JSX for Home page
 * @returns jsx for the form element Home
 */
export default function Home() {
  // Global datacontext for the website
  const dataContext = useContext(DataContext);
  // State to indicate the status o form i.e. submitted or not submitted
  const [formSubmitted, setFormSubmitted] = useState(false);
  // State to indicate whther data is currently loading
  const [loading, setLoading] = useState(false);
  // State to indicate whether an error occured during data fetching
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  function getThirdPartyData(data) {
    const details = data.details || {};
    const items = details.items || [];
    const thirdParty = transformData(items);
    dataContext.setData({
      type: "thirdPartySummary",
      data: thirdParty,
    });

    return items;
  }

  /**
   * Function to manage states on form submission and fetch data
   * @param {String} url Url of website
   * @param {Object} headers Headers that need to be sent in request along with url
   * @param {String} formFactor Type of device
   */
  async function onFormSubmit(url, formFactor, waitTime, dateString) {
    waitTime = Number(waitTime);
    setFormSubmitted(true);
    setLoading(true);
    try {
      let result;
      if (dateString) {
        result = await axios.get(`${REACT_APP_SERVER_URL}audit`, {
          method: "GET",
          params: {
            filename: dateString,
          },
        });
      } else {
        result = await axios.get(REACT_APP_SERVER_URL, {
          method: "GET",
          params: {
            url,
            formFactor,
            waitTime: isNaN(waitTime) ? 0 : waitTime * 1000,
          },
        });
      }
      console.log(result.data);
      setLoading(false);
      dataContext.setData({
        type: "analysisSetup",
        data: {
          deviceType: formFactor,
          url,
          waitTime: isNaN(waitTime) ? 0 : waitTime * 1000,
        },
      });
      const thirdParty = getThirdPartyData(result.data["third-party-summary"]);
      dataContext.setData({
        type: "changeData",
        data: {
          data: result.data,
          thirdParty: thirdParty,
        },
      });
      navigate("/third-party-summary");
    } catch (error) {
      setError(true);
      console.log(error);
    }
  }

  return (
    <>
     <div className="tog-container">
            <ThemeButton>Toggle Dark Mode</ThemeButton>
        </div>
      <div className="container">
        {!formSubmitted && <Form onFormSubmit={onFormSubmit} />}
        {formSubmitted && loading && !error && <div className="loader"></div>}
        {formSubmitted && error && <h1>Error..</h1>}
      </div>
    </>
  );
}
