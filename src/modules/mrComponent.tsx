import { Component } from "react";
import Basic from "./basic";
import { Provider } from "react-redux";
import store from "@store/store";

export default class MRComponent extends Component {
  render() {
    return (
      <Provider store={store}>
        <Basic />
      </Provider>
    );
  }
}
