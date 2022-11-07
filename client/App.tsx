import { React, ReactDOM, ReactDOMServer } from "../deps.ts";

export default function App() {
  return (` <!DOCTYPE html>
    ${
      ReactDOMServer.renderToString(
      <div>
        <h1>Hello react App component.</h1>
        <button>Hi.</button>
      </div>,
      )
    }`);
}