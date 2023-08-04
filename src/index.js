import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./Contexts/ContextProvider";
import axios from 'axios';
// config axios
axios.defaults.baseURL = process.env.REACT_APP_URL_BACKEND;
console.log(process.env.REACT_APP_URL_BACKEND);
ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("root")
);
