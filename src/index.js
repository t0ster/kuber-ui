import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import config from "./config";
import Parse from "parse";

Parse.initialize(
  config.REACT_APP_PARSE_APP_ID,
  config.REACT_APP_PARSE_MASTER_KEY
);
Parse.serverURL = config.REACT_APP_PARSE_URL;

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot) {
  module.hot.accept();
}
