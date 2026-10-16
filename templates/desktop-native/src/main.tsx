import { render } from "@epoch32/visage";
import { App } from "./App";
import "./style.css";

const root = document.getElementById("app");
if (root) {
  render(() => <App />, root);
}
