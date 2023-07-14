import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./styles/index.scss";

import Login from "./components/Auth/Login";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Title from "./components/Title";

import Dashboard from "./components/Dashboard";

import Topics from "./components/Topics";
import CreateTopics from "./components/Topics/Create";

import Occupation from "./components/Occupation";
import CreateOccupation from "./components/Occupation/Create";

import News from "./components/News";
import CreateNews from "./components/News/Create";

import Users from "./components/Users";

const RootComponent = () => {
  return (
    <div className="home-wrapper">
      <Sidebar />
      <div>
        <Navbar />
        <div className="home">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <RootComponent />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "title",
        element: <Title />,
      },
    ],
  },

  {
    path: "/topics",
    element: <RootComponent />,
    children: [
      {
        path: "",
        element: <Topics />,
      },
      {
        path: "create",
        element: <CreateTopics />,
      },
      {
        path: "create/:topicId",
        element: <CreateTopics />,
      },
    ],
  },

  {
    path: "/occupation",
    element: <RootComponent />,
    children: [
      {
        path: "",
        element: <Occupation />,
      },
      {
        path: "create",
        element: <CreateOccupation />,
      },
      {
        path: "create/:occupationId",
        element: <CreateOccupation />,
      },
    ],
  },

  {
    path: "/news",
    element: <RootComponent />,
    children: [
      {
        path: "",
        element: <News />,
      },
      {
        path: "create",
        element: <CreateNews />,
      },
      {
        path: "create/:newsId",
        element: <CreateNews />,
      },
    ],
  },

  {
    path: "/users",
    element: <RootComponent />,
    children: [
      {
        path: "",
        element: <Users />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={router} />);
