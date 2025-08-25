const React = require("react");
const ReactDOM = require("react-dom/client");

document.title = "Hello";

function App() {
  return <>
    <h1>Hello, Nagi!</h1>
  </>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
