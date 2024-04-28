import { createContext, useContext } from "react";

export const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const storeReducer = (state, newState) => {
  return { ...state, ...newState };
};