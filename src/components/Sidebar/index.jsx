import React from "react";
import { NavLink } from "react-router-dom";
import "./index.scss";

const index = () => {
  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <h3>Sojo News</h3>
        </div>

        <div className="links-wrapper">
          <NavLink className="link-item" to={"/"}>
            Dashboard
          </NavLink>

          <NavLink className="link-item" to={"/news"}>
            News
          </NavLink>

          <NavLink className="link-item" to={"/topics"}>
            Topics
          </NavLink>
          <NavLink className="link-item" to={"/popularTopics"}>
            Topics By Popularity
          </NavLink>
          <NavLink className="link-item" to={"/popularStates"}>
            States By Popularity
          </NavLink>

          <NavLink className="link-item" to={"/occupation"}>
            Occupation
          </NavLink>

          <NavLink className="link-item" to={"/stories"}>
            Stories
          </NavLink>

          <NavLink className="link-item" to={"/title"}>
            Title
          </NavLink>

          <NavLink className="link-item" to={"/ads"}>
            Ads
          </NavLink>

          <NavLink className="link-item" to={"/users"}>
            Users
          </NavLink>

          <NavLink className="link-item" to={"/usersByActivity"}>
            Users By Activity
          </NavLink>

          <NavLink className="link-item" to={"/analytics"}>
            Analytics
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default index;
