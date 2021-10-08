import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import axios from "axios";
import { useSelector } from "react-redux";

const NewUser = () => {
  let { auth } = useSelector((state) => state);

  let [newUser, setNewUser] = useState({
    email: "",
    password: "",
    cpassword: ""
  });

  function handleChange(e) {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.cpassword) {
      return window.alert("Passwords Don't Match");
    } else {
      try {
        let res = await axios.post(
          "http://localhost:5000/users",
          {
            email: newUser.email,
            password: newUser.password
          },
          {
            headers: {
              "x-auth-token": auth.token
            }
          }
        );
        if (res.status === 200) {
          alert("User Registered Successfully");
        }
        setNewUser({ email: "", password: "", cpassword: "" });
      } catch (err) {
        alert("Email Already Exists");
      }
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <div className="container col-md-4 col-sm-8">
        <h4 className="fw-bold p-3 text-primary">Add New User/s</h4>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label fw-bold">
              Email address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              required
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label fw-bold">
              Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              minLength="6"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword2" className="form-label fw-bold">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              minLength="6"
              name="cpassword"
              value={newUser.cpassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary m-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
