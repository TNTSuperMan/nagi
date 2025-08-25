require("./style.css");

const axios = require("axios");
const React = require("react");
const ReactDOM = require("react-dom/client");

document.title = "ログイン";

function App() {
  const [step] = React.useState("login");
  const [err, setErr] = React.useState();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = React.useCallback(async e => {
    axios.post("/api/auth/login/", {
      username: username,
      password: password,
    }).then(response => {
      if(response.status === 200){
        location.href = "/home";
      }else{
        setErr("二段階認証はまだ未実装です");
      }
    }).catch(error => {
      if(error instanceof axios.AxiosError){
        setErr(error.response.data.error);
      }else{
        setErr("内部エラーが発生しました");
      }
    });
    e.preventDefault();
  }, [username, password]);

  return <>
    <h1>ログイン</h1>
    {err && <div className="error">{err}</div>}
    {step === "login" && <>
      <form onSubmit={handleLogin}>
        <table>
          <tbody>
            <tr>
              <td>ユーザー名:</td>
              <td><input type="text" name="username" value={username} onChange={e=>setUsername(e.target.value)} /></td>
            </tr>
            <tr>
              <td>パスワード:</td>
              <td><input type="password" name="password" value={password} onChange={e=>setPassword(e.target.value)} /></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="ログイン" />
      </form>
    </>}
  </>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
