import { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../actions/auth";
import store from "../store";
import { useSelector } from "react-redux";

export default function Navbar() {
  let { auth } = useSelector((state) => state);

  let [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <nav className="navbar sticky-top navbar-expand-lg ps-5 pe-5 navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bolder" to="/">
          <h1 className="fw-bold">Blogs</h1>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          {token ? (
            <div className="navbar-nav ms-auto">
              <Link
                className="text-dark fw-bold text-decoration-none p-3"
                to="/"
              >
                Welcome {auth.user ? <>{auth.user.email}</> : <></>}
              </Link>
              {/* <Link
                className="text-dark fw-bold text-decoration-none p-3"
                to="/writeblog"
              >
                Write Blog
              </Link> */}
              <Link
                to="/"
                onClick={() => {
                  localStorage.setItem("token", "");
                  localStorage.setItem("email", "");
                  setToken(localStorage.getItem("token"));
                  store.dispatch(logout());
                }}
                className="text-dark fw-bold text-decoration-none p-3"
              >
                Logout
              </Link>
            </div>
          ) : (
            <div className="navbar-nav ms-auto">
              <Link
                className="text-dark fw-bold text-decoration-none p-3"
                to="/register"
              >
                Sign Up
              </Link>
              <Link
                className="text-dark fw-bold text-decoration-none p-3"
                to="/login"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
