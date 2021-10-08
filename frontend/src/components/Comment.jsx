import { useState, useEffect } from "react";
import axios from "axios";

const Comment = ({ pid }) => {
  let [comments, setComments] = useState([]);
  let [loadMore, setLoadMore] = useState(1);

  const getMoreComments = async () => {
    try {
      let res = await axios.post(
        `http://localhost:5000/comments/v1/${pid}?page=${loadMore}&limit=2`
      );
      setComments(res.data);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    getMoreComments();
  }, [loadMore]);

  return (
    <>
      {comments.length ? <h5 className="fw-bold text-end">Comments</h5> : <></>}
      {comments.map((val) => {
        return (
          <figure className="ms-auto text-end col-md-6 col-sm-8">
            <blockquote>{val.content}</blockquote>
            <figcaption className="blockquote-footer">
              {val.email + " " + val.create_time.slice(0, 10)}
            </figcaption>
          </figure>
        );
      })}
      {comments.length >= 2 ? (
        <button
          id={pid}
          onClick={() => {
            setLoadMore((prev) => prev + 1);
          }}
          className="btn btn-light border-dark m-3"
        >
          load more comments
        </button>
      ) : (
        <></>
      )}
    </>
  );
};

export default Comment;
