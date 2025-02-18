import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import store from "Redux/store"

import App from "Root/App";

const renderApp = Component => {
  render(
    <Provider store={store}>{Component}</Provider>,
    document.querySelector("#root")
  );
};

renderApp(<App />);
