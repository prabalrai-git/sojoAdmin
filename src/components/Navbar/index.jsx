import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { logout } from "./../../helper/auth";
import Axios from "./../../api/server";

const Navbar = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await Axios.get("/users/profile", config);
    } catch (err) {
      console.log(err);
      logout();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    config && fetchProfile();
  }, [config]);

  return (
    <div className="navbar">
      <div></div>
      <div className="links">
        <Link to="/news/create" className="link">
          Create News
        </Link>
        <p
          className="link"
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
        >
          Logout
        </p>
      </div>
    </div>
  );
};

export default Navbar;
