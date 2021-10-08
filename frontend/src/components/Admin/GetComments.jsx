import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const GetComments = () => {
  let { auth } = useSelector((state) => state);
  let [comments, setComments] = useState([]);
  let [search, setSearch] = useState("");

  let [edit, setEdit] = useState({
    id: "",
    author: "",
    comment: ""
  });

  const getComments = async () => {
    try {
      let res = await axios.get("http://localhost:5000/admin/comments");
      setComments(res.data);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    getComments();
  }, [search]);

  const handleSearch = async () => {
    try {
      search = parseInt(search, 10);
      if (isNaN(search)) {
        alert("Please Enter a valid number");
        return;
      } else {
        let result = comments.filter((val, idx) => {
          return val.comment_id === search;
        });
        setComments(result);
        return;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  function handleClick(e) {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "approved") {
      const changeUserType = async () => {
        try {
          await axios.patch(
            "http://localhost:5000/admin/comments/revoke",
            {
              id: value
            },
            {
              headers: {
                "x-auth-token": auth.token
              }
            }
          );
          getComments();
        } catch (err) {
          console.warn(err);
        }
      };
      changeUserType();
    } else if (name === "rejected") {
      const changeUserType = async () => {
        try {
          await axios.patch(
            "http://localhost:5000/admin/comments/grant",
            {
              id: value
            },
            {
              headers: {
                "x-auth-token": auth.token
              }
            }
          );
          getComments();
        } catch (err) {
          console.warn(err);
        }
      };
      changeUserType();
    } else if (name === "delete") {
      const deleteUser = async () => {
        try {
          await axios.delete(`http://localhost:5000/comments/${value}`, {
            headers: {
              "x-auth-token": auth.token
            }
          });
          alert(`Deleted comment_id ${value}`);
          getComments();
        } catch (err) {
          console.warn(err);
        }
      };
      deleteUser();
    }
  }

  return (
    <>
      <div className="container my-5">
        <h1 className="fw-bold text-decoration-underline">All Comments</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-3 col-sm-12">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by Comment_id"
            />
            <button onClick={handleSearch} className="btn btn-primary m-1">
              Go
            </button>
          </div>
          <div className="col-md-12 col-sm-12 table-responsive user-list">
            <table
              className="table table-bordered border-muted table-striped table-light"
              id="user-list"
              onClick={handleClick}
            >
              <thead className="table-light">
                <tr>
                  <th scope="col">Comment_id</th>
                  <th scope="col">Content</th>
                  <th scope="col">Post_id</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((val, idx) => {
                  return (
                    <tr key={val.comment_id}>
                      <th scope="row">{val.comment_id}</th>
                      <td>
                        {val.content}
                        {/* Modal */}
                        {/* <!-- Button trigger modal --> */}
                        <button
                          onClick={() => {
                            setEdit({
                              ...edit,
                              ["id"]: val.comment_id,
                              ["comment"]: val.content,
                              ["author"]: val.author
                            });
                          }}
                          type="button"
                          className="btn btn-link btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target={"#modal" + val.comment_id}
                        >
                          edit
                        </button>

                        {/* <!-- Modal Start--> */}
                        <div
                          className="modal fade"
                          id={"modal" + val.comment_id}
                          tabindex="-1"
                          aria-labelledby={val.comment_id + "aria-label"}
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5
                                  className="modal-title"
                                  id="exampleModalLabel"
                                >
                                  Edit Comment
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>

                              {/* <!-- Modal body Start--> */}

                              <div className="modal-body">
                                <div className="m-3">
                                  <label className="form-label m-2 fw-bold">
                                    Author Name
                                  </label>
                                  <input
                                    value={edit.author}
                                    onChange={(e) => {
                                      setEdit({
                                        ...edit,
                                        ["author"]: e.target.value
                                      });
                                    }}
                                    placeholder="Write Author name"
                                    type="text"
                                    className="form-control"
                                  />
                                </div>
                                <label className="form-label m-2 fw-bold required-field">
                                  Comment Text
                                </label>
                                <textarea
                                  value={edit.comment}
                                  onChange={(e) => {
                                    setEdit({
                                      ...edit,
                                      ["comment"]: e.target.value
                                    });
                                  }}
                                  placeholder="Write Comment here..."
                                  type="text"
                                  className="form-control"
                                />
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Close
                                </button>
                                <button
                                  onClick={async () => {
                                    try {
                                      let res = await axios.patch(
                                        `http://localhost:5000/comments/${edit.id}`,
                                        {
                                          author: edit.author,
                                          content: edit.comment
                                        },
                                        {
                                          headers: {
                                            "x-auth-token": auth.token
                                          }
                                        }
                                      );
                                      getComments();
                                      if (res.status == 200) {
                                        alert("Comment Updated Successfully");
                                      }
                                    } catch (err) {
                                      console.warn(err);
                                    }
                                  }}
                                  type="button"
                                  className="btn btn-primary"
                                >
                                  Save changes
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <!-- Modal body end--> */}
                        {/* Modal */}
                      </td>
                      <td>{val.post_id}</td>
                      <td>
                        {val.status === "1" ? (
                          <button
                            value={val.comment_id}
                            name="rejected"
                            className="btn m-1 btn-warning"
                          >
                            Private
                          </button>
                        ) : (
                          <button
                            value={val.comment_id}
                            name="approved"
                            className="btn  m-1 btn-primary"
                          >
                            Public
                          </button>
                        )}
                        <button
                          value={val.comment_id}
                          name="delete"
                          className="btn m-1 btn-danger"
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
      <Link to="/admin/home/comments/newcomment">Add New Comment</Link>
    </>
  );
};

export default GetComments;
