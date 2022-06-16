import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";
// Create the context
export const DataContext = createContext({});

/**
 * Function to update the current state of the data
 * @param {object} state - The current state of the data
 * @param {object} action - The action to be performed
 * @returns {object} - The new state of the data
 */
const switchData = (state, action) => {
  switch (action.type) {
    case "changeData":
      return { ...state, ...action.data};
    case "updateThirdPartyData":
      return {...state, thirdParty:action.data}
    case "analysisSetup": 
      return {...state, config: action.data}
    default:
      return state;
  }

};

// Create the provider.
const DataContextProvider = ({ children }) => {
  // Initialize the state
  const [data, setData] = useReducer(switchData, {
    data: {},
    thirdParty:{},
    config: {
      deviceType: 'mobile',
      url: '',
      waitTime: 60000
    }
  });

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

DataContextProvider.propTypes = {
  children: PropTypes.element,
};

export default DataContextProvider;
