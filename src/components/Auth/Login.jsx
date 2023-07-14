import React, { useState, useEffect } from "react";
import "./index.scss";
import { checkJwtToken } from "./../../helper/auth";
import Axios from "./../../api/server";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (err) {
      toast.error(err, {
        theme: "colored",
      });
      setErr(null);
    }
  }, [err]);

  useEffect(() => {
    if (checkJwtToken()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email,
      password,
    };
    try {
      const res = await Axios.post("/auth/login", data);
      console.log(res.data.data);
      if (res.data.data.role !== "admin") {
        setErr("Unauthorized");
        return false;
      }
      localStorage.setItem("accessToken", res.data.data.token);
      navigate("/");
    } catch (err) {
      console.log(err);
      setErr(err.response.data.err);
      //   setErr(null);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <h2 className="title">Admin Login</h2>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="login-form">
            <label className="label" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="loginInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="label" htmlFor="password">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="loginInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="loginBtn">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
