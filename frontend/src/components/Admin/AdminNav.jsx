import { Link } from "react-router-dom";
import { adminlogout } from "../../actions/auth";
import store from "../../store";
import { useSelector } from "react-redux";

export default function AdminNav() {
  let { auth } = useSelector((state) => state);

  return (
    <nav
      style={{ borderRadius: "0 0 25px 25px" }}
      className="navbar navbar-expand-lg ps-5 pe-5 navbar-dark bg-dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bolder" to="/admin/home">
          <h6 className="fw-bold">
            Welcome {auth.user ? <>{auth.user.email}</> : <></>}
          </h6>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link
              className="text-light fw-bold text-decoration-none p-3"
              to="/admin"
              onClick={() => {
                store.dispatch(adminlogout());
              }}
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
