import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../App";
import "./AdminUserList.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminUsersList = () => {
  let { auth } = useSelector((state) => state);
  const { list, setList, getUserList } = useContext(Context);
  let [search, setSearch] = useState("");

  useEffect(() => {
    getUserList();
  }, [search]);

  function handleClick(e) {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "admin") {
      const changeUserType = async () => {
        try {
          await axios.patch(
            "http://localhost:5000/admin/users/revoke",
            {
              id: value
            },
            {
              headers: {
                "x-auth-token": auth.token
              }
            }
          );
          getUserList();
        } catch (err) {
          console.warn(err);
        }
      };
      changeUserType();
    } else if (name === "user") {
      const changeUserType = async () => {
        try {
          await axios.patch(
            "http://localhost:5000/admin/users/grant",
            {
              id: value
            },
            {
              headers: {
                "x-auth-token": auth.token
              }
            }
          );
          getUserList();
        } catch (err) {
          console.warn(err);
        }
      };
      changeUserType();
    } else if (name === "delete") {
      console.log(value);
      const deleteUser = async () => {
        try {
          await axios.delete(`http://localhost:5000/users/${value}`, {
            headers: {
              "x-auth-token": auth.token
            }
          });
          alert(`Deleted user_id ${value}`);
          getUserList();
        } catch (err) {
          console.warn(err);
        }
      };
      deleteUser();
    }
  }

  const handleSearch = async () => {
    try {
      search = parseInt(search, 10);
      if (isNaN(search)) {
        alert("Please Enter a valid number");
        return;
      } else {
        let result = list.filter((val, idx) => {
          return val.user_id === search;
        });
        setList(result);
        return;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      <div className="container my-5">
        <h1 className="fw-bold text-decoration-underline">User List</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-3 col-sm-12">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by User_id"
            />
            <button onClick={handleSearch} className="btn btn-primary m-1">
              Go
            </button>
          </div>
          <div className="col-md-12 col-sm-12 table-responsive user-list">
            <table
              className="table table-bordered border-muted table-striped table-warning"
              id="user-list"
              onClick={handleClick}
            >
              <thead className="table-light">
                <tr>
                  <th scope="col">User_id</th>
                  <th scope="col">Email</th>
                  <th scope="col">Profile</th>
                  <th scope="col">User Type</th>
                </tr>
              </thead>
              <tbody>
                {list.map((val, idx) => {
                  return (
                    <tr key={val.user_id}>
                      <th scope="row">{val.user_id}</th>
                      <td>{val.email}</td>
                      <td>{val.profile ? <>{val.profile}</> : <>null</>}</td>
                      <td>
                        {val.user_type === "1" ? (
                          <button
                            value={val.user_id}
                            name="admin"
                            className="btn m-1 btn-warning"
                          >
                            Admin
                          </button>
                        ) : (
                          <button
                            value={val.user_id}
                            name="user"
                            className="btn  m-1 btn-primary"
                          >
                            User
                          </button>
                        )}
                        <button
                          value={val.user_id}
                          name="delete"
                          className="btn  m-1 btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Link to="/admin/home/users/newuser">Add New User</Link>
    </>
  );
};

export default AdminUsersList;
