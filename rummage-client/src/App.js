import React, { Component } from "react";
import logo from "./rummage-logo-grey.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App__header">
          <img src={logo} className="App__logo" alt="Rummage" />
        </div>
      </div>
    );
  }
}

export default App;
