import PropTypes from "prop-types";
import { createContext, useReducer } from "react";
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
    case "analysisSetup": 
      return {...state, config: action.data}
    case "thirdPartySummary":
      return {...state, thirdPartySummary:action.data}
    case "updateThirdParty":
      return {...state, insights:action.data}
    default:
      return state;
  }

};

// Create the provider.
const DataContextProvider = ({ children }) => {
  // Initialize the state
  const [data, setData] = useReducer(switchData, {
    thirdPartySummary:{},
    data: {},
    thirdParty:{},
    insights:{},
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
