import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./Contexts/ContextProvider";
import axios from 'axios';

// config axios
axios.defaults.baseURL = "http://127.0.0.1:8080/api";
ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("root")
);
