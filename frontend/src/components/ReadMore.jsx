import { useState } from "react";
import { Link } from "react-router-dom";
import { Markup } from "interweave";

const ReadMore = ({ content }) => {
  let [text, setText] = useState(content.slice(0, 150));
  let [readMore, setReadMore] = useState(true);

  return (
    <>
      {readMore ? (
        <>
          <Markup content={text} />
          <Link
            to=""
            onClick={() => {
              setReadMore(false);
            }}
          >
            read more
          </Link>
        </>
      ) : (
        <>
          <Markup content={content} />
          <Link
            to=""
            onClick={() => {
              setReadMore(true);
            }}
          >
            read less
          </Link>
        </>
      )}
    </>
  );
};

export default ReadMore;
