require("./style.css");

const React = require("react");
const ReactDOM = require("react-dom/client");

document.title = "Home";

function App() {
  const [session, setSession] = React.useState();

  React.useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/auth/session", true);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4) {
        const body = JSON.parse(xhr.responseText);
        if(body === null) {
          location.href = "/login.html";
        } else {
          setSession(body);
        }
      }
    };
    xhr.send();
  }, []);

  if(!session) {
    return <>読込中...</>;
  }

  return <>
    <h1>ようこそ、{session.handle}さん</h1>
  </>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
