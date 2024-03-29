import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { reducers } from "./redux/reducers";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { AuthenticationProvider } from './contexts/authenticationContext'

const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthenticationProvider>
          <App />
        </AuthenticationProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode >,
  document.getElementById("root")
);
