import React, { createContext, useReducer } from 'react';

export const DataContext = createContext();

const switchData = (state, action) => {
  switch (action.type) {
    case "changeData":
      return { ...state, data: action.data };
    default:
      return state;
  }
}

const DataContextProvider = (props) => {
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