import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const GetPosts = () => {
  let { auth } = useSelector((state) => state);
  let [posts, setPosts] = useState([]);
  let [search, setSearch] = useState("");

  let [edit, setEdit] = useState({
    id: "",
    title: "",
    tags: "",
    content: ""
  });

  const getPosts = async () => {
    try {
      let res = await axios.get("http://localhost:5000/admin/posts");
      setPosts(res.data);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, [search]);

  const handleSearch = async () => {
    try {
      search = parseInt(search, 10);
      if (isNaN(search)) {
        alert("Please Enter a valid number");
        return;
      } else {
        let result = posts.filter((val, idx) => {
          return val.post_id === search;
        });
        setPosts(result);
        return;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  function handleClick(e) {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "public") {
      const changeUserType = async () => {
        try {
          console.log("pub");

          await axios.patch(
            "http://localhost:5000/admin/posts/revoke",
            {
              id: value
            },
            {
              headers: {
                "x-auth-token": auth.token
              }
            }
          );
          getPosts();
        } catch (err) {
          console.warn(err);
        }
      };
      changeUserType();
    } else if (name === "private") {
      const changeUserType = async () => {
        try {
          console.log("pri");

          await axios.patch(
            "http://localhost:5000/admin/posts/grant",
            {
              id: value
            },
            {
              headers: {
                "x-auth-token": auth.token
              }
            }
          );
          getPosts();
        } catch (err) {
          console.warn(err);
        }
      };
      changeUserType();
    } else if (name === "delete") {
      console.log(value);
      const deleteUser = async () => {
        try {
          await axios.delete(`http://localhost:5000/posts/${value}`, {
            headers: {
              "x-auth-token": auth.token
            }
          });
          alert(`Deleted post_id ${value}`);
          getPosts();
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
        <h1 className="fw-bold text-decoration-underline">All Posts</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-3 col-sm-12">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by Post_id"
            />
            <button onClick={handleSearch} className="btn btn-primary m-1">
              Go
            </button>
          </div>
          <div className="col-md-12 col-sm-12 table-responsive user-list">
            <table
              className="table table-bordered border-muted table-striped table-primary"
              id="user-list"
              onClick={handleClick}
            >
              <thead className="table-light">
                <tr>
                  <th scope="col">Post_id</th>
                  <th scope="col">Title</th>
                  <th scope="col">User_id</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((val, idx) => {
                  return (
                    <tr key={val.post_id}>
                      <th scope="row">{val.post_id}</th>
                      <td>
                        {val.title}

                        {/* Modal Start*/}
                        {/* <!-- Button trigger modal start--> */}
                        <button
                          onClick={() => {
                            setEdit({
                              ...edit,
                              ["id"]: val.post_id,
                              ["tags"]: val.tags,
                              ["content"]: val.content,
                              ["title"]: val.title
                            });
                          }}
                          type="button"
                          className="btn btn-link btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target={"#modal" + val.post_id}
                        >
                          edit
                        </button>
                        {/* <!-- Button trigger modal end--> */}

                        {/* <!-- Modal body start--> */}
                        <div
                          className="modal fade"
                          id={"modal" + val.post_id}
                          tabindex="-1"
                          aria-labelledby={val.post_id + "aria-label"}
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5
                                  className="modal-title"
                                  id="exampleModalLabel"
                                >
                                  Edit Post
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>

                              <div className="modal-body">
                                {/* Updating/edit the Posts - start */}
                                <div className="m-3">
                                  <label className="form-label m-2 fw-bold">
                                    Title<span className="text-danger"> *</span>
                                  </label>
                                  <input
                                    value={edit.title}
                                    onChange={(e) => {
                                      setEdit({
                                        ...edit,
                                        ["title"]: e.target.value
                                      });
                                    }}
                                    placeholder="Write new title..."
                                    type="text"
                                    className="form-control"
                                  />
                                  <label className="form-label m-2 fw-bold">
                                    Tags
                                  </label>
                                  <input
                                    value={edit.tags}
                                    onChange={(e) => {
                                      setEdit({
                                        ...edit,
                                        ["tags"]: e.target.value
                                      });
                                    }}
                                    placeholder="Write new title..."
                                    type="text"
                                    className="form-control"
                                  />
                                </div>
                                <label className="form-label m-2 fw-bold">
                                  Content
                                  <span className="text-danger"> *</span>
                                </label>
                                <textarea
                                  value={edit.content}
                                  onChange={(e) => {
                                    setEdit({
                                      ...edit,
                                      ["content"]: e.target.value
                                    });
                                  }}
                                  placeholder="Write new content..."
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
                                        `http://localhost:5000/posts/${edit.id}`,
                                        {
                                          title: edit.title,
                                          tags: edit.tags,
                                          content: edit.content
                                        },
                                        {
                                          headers: {
                                            "x-auth-token": auth.token
                                          }
                                        }
                                      );
                                      getPosts();
                                      if (res.status === 204) {
                                        alert("Post Updated Successfully");
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
                        {/* Updating/edit the Posts - end */}
                        {/* Modal - End */}
                      </td>
                      <td>{val.user_id}</td>
                      <td>
                        {val.status === "1" ? (
                          <button
                            value={val.post_id}
                            name="private"
                            className="btn m-1 btn-warning"
                          >
                            Private
                          </button>
                        ) : (
                          <button
                            value={val.post_id}
                            name="public"
                            className="btn  m-1 btn-primary"
                          >
                            Public
                          </button>
                        )}
                        <button
                          value={val.post_id}
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
      <Link to="posts/newpost">Add New Post</Link>
    </>
  );
};

export default GetPosts;
