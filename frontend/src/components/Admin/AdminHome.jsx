import React from "react";
import AdminUsersList from "./AdminUsersList";
import GetPosts from "./GetPosts";
import { Link, Switch, Route, BrowserRouter as Router } from "react-router-dom";
import GetComments from "./GetComments";
import AdminNav from "./AdminNav";
import Admin from "./Admin";
import NewUser from "./NewUser";
import NewComment from "./NewComment";
import NewPost from "./NewPost";
import { useSelector } from "react-redux";
import NotFound from "../NotFound";
function AdminHome() {
  let { auth } = useSelector((state) => state);

  return (
    <>
      <AdminNav />
      <Router>
        <div className="container mt-5">
          <div className="row">
            <div className="col">
              <Link to="/admin/home/users" className=" fw-bold">
                <h5>Users</h5>
              </Link>
            </div>
            <div className="col">
              <Link to="/admin/home/posts" className=" fw-bold">
                <h5>Posts</h5>
              </Link>
            </div>
            <div className="col">
              <Link to="/admin/home/comments" className=" fw-bold">
                <h5>Comments</h5>
              </Link>
            </div>
          </div>
        </div>

        <Switch>
          <Route exact path="/admin">
            <AdminUsersList />
          </Route>
          <Route exact path="/admin/home">
            <AdminUsersList />
          </Route>
          <Route exact path="/admin/home/users">
            <AdminUsersList />
          </Route>
          <Route exact path="/admin/home/posts">
            <GetPosts />
          </Route>
          <Route exact path="/admin/home/comments">
            <GetComments />
          </Route>
          <Route
            exact
            path="/admin/home/users/newuser"
            render={() =>
              // localStorage.getItem("admintoken") ? <NewUser /> : <Admin />
              auth.isAdmin ? <NewUser /> : <Admin />
            }
          />
          <Route
            exact
            path="/admin/home/posts/newpost"
            render={() =>
              // localStorage.getItem("admintoken") ? <NewPost /> : <Admin />
              auth.isAdmin ? <NewPost /> : <Admin />
            }
          />
          <Route
            exact
            path="/admin/home/comments/newcomment"
            render={() =>
              // localStorage.getItem("admintoken") ? <NewComment /> : <Admin />
              auth.isAdmin ? <NewComment /> : <Admin />
            }
          />
          <Route exact path="*" render={() => <NotFound loc="/admin/home" />} />
        </Switch>
      </Router>
    </>
  );
}

export default AdminHome;
