import { useState, useEffect } from "react";
import axios from "axios";
import ReadMore from "./ReadMore";
import Comment from "./Comment";
import emojis from "../utils/emojis";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";

const Post = () => {
  let { auth } = useSelector((state) => state);
  let [posts, setPosts] = useState([]);
  let [writeComment, setWriteComment] = useState("");
  let [cauthor, setCAuthor] = useState("");
  let [loadMore, setLoadMore] = useState(1);
  let [loading, setLoading] = useState(true);

  const getPosts = async () => {
    try {
      setLoading(true);
      let res = await axios.post(
        `http://localhost:5000/posts/v1?page=${loadMore}&limit=5`
      );
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, [loadMore]);

  const handleClick = async (e) => {
    try {
      if (!writeComment) {
        return alert("Comment cannot be empty");
      }
      let res = await axios.post(
        "http://localhost:5000/comments",
        {
          author: auth.user.email.split("@")[0] || "Default",
          content: writeComment,
          email: auth.user.email,
          post_id: e.target.value,
          user_id: auth.user.user_id
        },
        {
          headers: {
            "x-auth-token": auth.token
          }
        }
      );
      if (res.status === 201) {
        alert("Comment Posted successfully");
      }
      setWriteComment("");
      setCAuthor("");
    } catch (err) {
      alert("You should be logged in to post comments");
    }
  };

  return (
    <>
      {posts.map((pval) => {
        return (
          <>
            <div className="card col-md-8 col-sm-10 mx-auto m-4">
              <div className="card-body ">
                <h3 className="card-title p-3">{pval.title}</h3>
                <div className="text-end mb-4">
                  <button className="card-text btn btn-danger">
                    {pval.tags}
                  </button>
                </div>
                <p className="card-text text-start">
                  <ReadMore content={pval.content} />
                </p>
                <p className="card-text">
                  <small className="text-muted">
                    Created At-{pval.update_time.slice(0, 10)}
                  </small>
                </p>
                <Comment id={`$pval.post_id`} pid={pval.post_id} />

                <div className="text-end">
                  {/* Comment Modal Start */}

                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={"#com" + pval.post_id}
                  >
                    Write Comment
                  </button>
                  {auth.token ? (
                    <></>
                  ) : (
                    <p className="mt-3 text-danger">
                      <span>* </span>You should be loggedin to post comments
                    </p>
                  )}
                  <div
                    className="modal fade"
                    id={"com" + pval.post_id}
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Write your comment
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body p-3">
                          <textarea
                            type="text"
                            className="form-control m-2"
                            name="comment"
                            placeholder="Write a comment"
                            value={writeComment}
                            onChange={(e) => setWriteComment(e.target.value)}
                          />
                          <input
                            type="text"
                            className="form-control m-2"
                            name="author"
                            placeholder="Author name(optional)"
                            value={cauthor}
                            onChange={(e) => setCAuthor(e.target.value)}
                          />
                          <div className="container-fluid">
                            <div className="row">
                              {emojis.map((emoji) => {
                                return (
                                  <div className="col-md-2">
                                    <button
                                      value={emoji.emoji}
                                      onClick={(e) =>
                                        setWriteComment(
                                          writeComment.concat(e.target.value)
                                        )
                                      }
                                      className="btn"
                                    >
                                      {emoji.emoji}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
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
                            onClick={handleClick}
                            value={pval.post_id}
                            className="btn btn-primary my-2"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment Modal End */}
                </div>
              </div>
            </div>
          </>
        );
      })}
      {loading ? (
        <Spinner />
      ) : (
        <button
          onClick={() => {
            setLoadMore((prev) => prev + 1);
          }}
          className="btn btn-primary m-3"
        >
          Load More
        </button>
      )}
    </>
  );
};
export default Post;
