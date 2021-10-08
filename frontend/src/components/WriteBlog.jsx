import { useState } from "react";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
// import "./NewPost.css";

const WriteBlog = () => {
  let [newPost, setNewPost] = useState({
    title: "",
    tags: "",
    content: ""
  });

  const { title, tags, content } = newPost;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      return window.alert("Field's cannot be empty");
    } else {
      try {
        let response = await axios.post("http://localhost:5000/auth", {
          headers: {
            "x-auth-token": localStorage.getItem("token")
          }
        });

        let res = await axios.post(
          "http://localhost:5000/posts",
          {
            title,
            user_id: response.data.user_id,
            content,
            tags
          },
          {
            headers: {
              "x-auth-token": localStorage.getItem("token")
            }
          }
        );
        console.log(res);

        if (res.status === 201) {
          alert("Post Created Successfully");
        }
        // setNewPost({ title: "", tags: "", content: "" });
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <h1 className="fw-bold p-3 text-primary">Write Blog</h1>
        <form
          onSubmit={onSubmit}
          className="col-md-10 p-3 bg-light border col-sm-12 mx-auto"
        >
          {/* title */}
          <div className="m-3">
            <label className="form-label fw-bold">Title</label>
            <textarea
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, ["title"]: e.target.value })
              }
              placeholder="Write title here..."
              type="text"
              className="form-control"
              style={{ height: "60px" }}
            />
          </div>
          {/* title */}

          {/* tags */}
          <div className="m-3">
            <label className="form-label fw-bold">Tags</label>
            <textarea
              value={newPost.tags}
              onChange={(e) =>
                setNewPost({ ...newPost, ["tags"]: e.target.value })
              }
              type="text"
              placeholder="optional"
              className="form-control"
              style={{ height: "10px" }}
            />
          </div>
          {/* tags */}

          {/* content */}
          <div className="m-3">
            <label className="form-label fw-bold">Content</label>
            <textarea
              placeholder="Write content here..."
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, ["content"]: e.target.value })
              }
              type="text"
              className="form-control"
              style={{ height: "100px" }}
            />
          </div>
          {/* content */}

          <button type="submit" className="btn btn-primary m-3">
            Submit
          </button>
          <div className="mt-3">
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
};

export default WriteBlog;
