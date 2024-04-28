import { createContext, useContext } from "react";

export const storeReducer = (state, newState) => {
  return { ...state, ...newState };
};

export const GlobalContext = createContext();
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const WindowContext = createContext();
export const useWindowContext = () => {
  return useContext(WindowContext);
};
