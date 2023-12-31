import React, { Component } from "react";
import { render } from "react-dom";
import Login from './Login';
export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      <Login/>
    </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);