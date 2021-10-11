import "./styles.css";
import { useEffect, createContext, useState } from "react";
import axios from "axios";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Login from "./components/Login";
import Admin from "./components/Admin/Admin";
import AdminHome from "./components/Admin/AdminHome";
import setAuthToken from "./utils/setAuthToken";
import { loadUser, loadAdmin } from "./actions/auth";
import store from "./store";
import { useSelector } from "react-redux";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const Context = createContext();

export default function App() {
  let { auth } = useSelector((state) => state);

  let [list, setList] = useState([]);

  async function getUserList() {
    try {
      let res = await axios.get("http://localhost:5000/users");
      setList(res.data);
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    getUserList();
    store.dispatch(loadUser());
    store.dispatch(loadAdmin());
  }, []);

  return (
    <Context.Provider value={{ list, setList, getUserList }}>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/register"
            render={() => (auth.isAuthenticated ? <Home /> : <Register />)}
          />
          <Route
            exact
            path="/login"
            render={() => (auth.isAuthenticated ? <Home /> : <Login />)}
          />
          <Route
            path="/admin"
            render={() => {
              if (auth.isAdmin) {
                return <AdminHome />;
              } else {
                return <Admin />;
              }
            }}
          />
          <Route exact path="*" render={() => <NotFound loc="/" />} />
        </Switch>
      </div>
    </Context.Provider>
  );
}

export { Context };
