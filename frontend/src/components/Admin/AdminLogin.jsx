import "./AdminLogin.css";
import { Link, useHistory } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useState } from "react";
import { connect } from "react-redux";
import { adminlogin } from "../../actions/auth";
import PropTypes from "prop-types";
import { loadAdmin } from "../../actions/auth";
import store from "../../store";

function AdminLogin({ adminlogin }) {
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
    e.preventDefault();
    let res = await adminlogin(email, password);

    if (res === 200) {
      store.dispatch(loadAdmin());
      alert(`Welcome ${email}`);
      history.push("/admin/home");
    }
  };

  return (
    <>
      <div className="alog-container container-fluid bg-dark">
        <div className="alog-inner-container container-fluid">
          <h1 className="fw-bolder text-primary">Admin Login</h1>
          <form onSubmit={onSubmit}>
            <div className="m-3">
              <label className="form-label fw-bold ">Email address</label>
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

AdminLogin.propTypes = {
  adminlogin: PropTypes.func.isRequired,
  loadAdmin: PropTypes.func.isRequired
};

export default connect(null, { adminlogin })(AdminLogin);
