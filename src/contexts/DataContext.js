import React, { createContext, useReducer } from 'react';

// Create the context
export const DataContext = createContext();

/**
 * Function to update the current state of the data
 * @param {object} state - The current state of the data
 * @param {object} action - The action to be performed
 * @returns {object} - The new state of the data
 */
const switchData = (state, action) => {
  switch (action.type) {
    case "changeData":
      return { ...state, data: action.data };
    default:
      return state;
  }
}

// Create the provider.
const DataContextProvider = (props) => {

  // Initialize the state
  const [data, setData] = useReducer(switchData, {
    data: {}
  })

  return (
    <DataContext.Provider value={{ data, setData }} >
      {props.children}
    </DataContext.Provider>
  )
}

export default DataContextProvider;