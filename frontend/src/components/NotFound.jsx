import "./NotFound.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";

function NotFound({ loc }) {
  return (
    <>
      <div className="nf-container bg-light">
        <div className="row justify-content-center align-items-center">
          <div className="col">
            <h1 className="nf-header">404</h1>
            <h1 className="nf-body">Page Not Found</h1>
          </div>
          <div>
            <Link to={loc}>
              <button className="btn btn-dark fw-bold rounded-circle">
                <AiOutlineArrowLeft className="display-6" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
