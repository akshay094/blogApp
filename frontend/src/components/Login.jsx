import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useState } from "react";
import { connect } from "react-redux";
import { login } from "../actions/auth";
import { loadUser } from "../actions/auth";
import PropTypes from "prop-types";
import store from "../store";

function Login({ login }) {
  let history = useHistory();
  let [loginData, setLoginData] = useState({
    email: null,
    password: null
  });

  const { email, password } = loginData;

  function handleChange(e) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      let res = await login(email, password);
      if (res === 200) {
        store.dispatch(loadUser());
        alert(`Welcome ${email}`);
        history.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="log-container bg-dark">
        <div className="log-inner-container">
          <h1 className="fw-bolder text-primary">Login</h1>
          <form onSubmit={onSubmit}>
            <div className="m-3">
              <label className="form-label fw-bold">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="m-3">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                minLength="6"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary m-3 fw-bold">
              Let's Go
            </button>
            {/* <Link className="text-light text-decoration-none fw-bold" to='/'><button className="btn btn-danger m-3">Go Back</button></Link> */}
            <div className="my-4">
              <Link to="/">
                <button className="btn btn-light fw-bold rounded-circle">
                  <AiOutlineArrowLeft className="display-6" />
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired
};

export default connect(null, { login })(Login);
