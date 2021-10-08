import "./Register.css";
import { connect } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { register } from "../actions/auth";
import propTypes from "prop-types";

function Register({ register }) {
  let [regData, setRegData] = useState({
    email: "",
    password: "",
    cpassword: ""
  });

  const { email, password } = regData;

  function handleChange(e) {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  }
  const onSubmit = (e) => {
    e.preventDefault();
    if (regData.password !== regData.cpassword) {
      return window.alert("Passwords Don't Match");
    } else {
      register({ email, password });
      setRegData({ email: "", password: "", cpassword: "" });
    }
  };

  return (
    <div className="reg-container bg-light">
      <div className="reg-inner-container">
        <h1 className="fw-bold p-3 text-primary">Sign Up</h1>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label ssName="form-label fw-bold">
              Email address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={regData.email}
              onChange={handleChange}
              required
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">
              Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              minLength="6"
              name="password"
              value={regData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              minLength="6"
              name="cpassword"
              value={regData.cpassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary m-3">
            Submit
          </button>
          <div className="my-5">
            <Link to="/">
              <button className="btn btn-dark fw-bold rounded-circle">
                <AiOutlineArrowLeft className="display-6" />
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

Register.propTypes = {
  register: propTypes.func.isRequired
};

export default connect(null, { register })(Register);
