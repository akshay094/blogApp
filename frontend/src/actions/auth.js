import axios from "axios";
import {
  USER_LOADED,
  AUTH_ERROR,
  ADMIN_LOGIN,
  ADMIN_LOADED,
  ADMIN_AUTH_ERROR
} from "./types";

import setAuthToken from "../utils/setAuthToken";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.post("http://localhost:5000/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (e) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const loadAdmin = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.post("http://localhost:5000/adminauth");
    dispatch({
      type: ADMIN_LOADED,
      payload: res.data
    });
  } catch (e) {
    dispatch({
      type: ADMIN_AUTH_ERROR
    });
  }
};

export const register = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("http://localhost:5000/users", body, config);
    console.log(res);
    if (res.status === 200) {
      window.alert("User registered successfully");
    }
  } catch (e) {
    return alert("Email already exists");
  }
};

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("http://localhost:5000/login", body, config);
    localStorage.setItem("token", res.data.token);
    dispatch({
      type: USER_LOADED
    });
    return res.status;
  } catch (e) {
    dispatch({
      type: AUTH_ERROR
    });
    return alert("Incorrect Username/Password");
  }
};

export const logout = () => async (dispatch) => {
  localStorage.setItem("token", "");
  localStorage.setItem("email", "");
  dispatch({
    type: AUTH_ERROR
  });
};

export const adminlogin = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(
      "http://localhost:5000/admin/login",
      body,
      config
    );
    localStorage.setItem("token", res.data.token);

    dispatch({
      type: ADMIN_LOGIN
    });
    return res.status;
  } catch (e) {
    dispatch({
      type: ADMIN_AUTH_ERROR
    });
    return alert("Incorrect Username/Password");
  }
};

export const adminlogout = () => async (dispatch) => {
  dispatch({
    type: ADMIN_AUTH_ERROR
  });
};
