import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Context } from "../../App";
import "./NewComment.css";
import { useSelector } from "react-redux";

const NewComment = () => {
  let { auth } = useSelector((state) => state);

  const { list, setList, getUserList } = useContext(Context);
  let [posts, setPosts] = useState([]);

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
  }, []);

  let [newComment, setNewComment] = useState({
    author: "",
    content: "",
    user_id: "",
    post_id: ""
  });

  const { author, content, user_id, post_id } = newComment;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content || !user_id || !post_id) {
      return window.alert("Field's cannot be empty");
    } else {
      try {
        let res = await axios.post(
          "http://localhost:5000/comments",
          {
            author,
            content,
            user_id,
            post_id
          },
          {
            headers: {
              "x-auth-token": auth.token
            }
          }
        );
        if (res.status === 201) {
          alert("Comment Created Successfully");
        }
        setNewComment({
          author: "",
          user_id: "",
          post_id: "",
          content: ""
        });
      } catch (err) {
        console.warn(err);
      }
    }
  };

  return (
    <div className="container-fluid mx-auto mt-5">
      <div className="container">
        <h4 className="fw-bold p-3 text-primary">Add New Comment/s</h4>
        <form
          onSubmit={onSubmit}
          className="col-md-10 p-3 bg-light border col-sm-12 mx-auto"
        >
          {/* dropdown button */}
          <div
            onClick={(e) => {
              setNewComment({
                ...newComment,
                ["user_id"]: e.target.innerText
              });
            }}
            className="dropdown m-3"
          >
            <Link
              className="btn btn-secondary dropdown-toggle"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Select user_id<span className="text-danger"> *</span>
            </Link>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                {list.map((val, idx) => {
                  return <span className="dropdown-item">{val.user_id}</span>;
                })}
              </li>
            </ul>
            <input
              className="mx-4 p-1 text-center"
              id="disabledTextInput"
              style={{ width: "200px" }}
              value={user_id}
              type="text"
            />
          </div>
          {/* dropdown button */}

          {/* dropdown button */}
          <div
            onClick={(e) => {
              setNewComment({
                ...newComment,
                ["post_id"]: e.target.innerText
              });
            }}
            className="dropdown"
          >
            <Link
              className="btn btn-secondary dropdown-toggle"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Select Post<span className="text-danger"> *</span>
            </Link>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                {posts.map((val, idx) => {
                  return <span className="dropdown-item">{val.post_id}</span>;
                })}
              </li>
            </ul>
            <input
              className="mx-4 p-1 text-center"
              id="disabledTextInput"
              style={{ width: "200px" }}
              value={post_id}
              type="text"
            />
          </div>
          {/* dropdown button */}

          {/* Author */}
          <div className="m-3">
            <label className="form-label fw-bold">Author Name</label>
            <input
              value={author}
              onChange={(e) =>
                setNewComment({ ...newComment, ["author"]: e.target.value })
              }
              placeholder="Optional"
              type="text"
              className="form-control"
            />
          </div>
          {/* Author */}

          {/* Content */}
          <div className="m-3">
            <label className="form-label fw-bold required-field">Content</label>
            <textarea
              value={content}
              onChange={(e) =>
                setNewComment({ ...newComment, ["content"]: e.target.value })
              }
              placeholder="Write Comment here..."
              type="text"
              className="form-control"
              style={{ height: "60px" }}
            />
          </div>
          {/* Content */}

          <button type="submit" className="btn btn-primary m-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewComment;
