require("./style.css");

const React = require("react");
const ReactDOM = require("react-dom/client");
const axios = require("axios");

document.title = "Home";

function App() {
  const [session, setSession] = React.useState();

  React.useEffect(() => {
    axios.post("/api/auth/session").then(response => {
      if(response.data === null) {
        location.href = "/login.html";
      } else {
        setSession(response.data);
      }
    });
  }, []);

  if(!session) {
    return <>読込中...</>;
  }

  return <>
    <h1>ようこそ、{session.handle}さん</h1>
  </>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
