import { Link } from "react-router-dom";
import "./index.scss";

const Dashboard = () => {
  return (
    <>
      <div className="main">
        <h3>Dashboard</h3>
        <div className="links">
          <Link to={"/news/create"} className="link">
            <div className="link-container">
              <p>Write a News Story</p>
              <div className="icon">+</div>
            </div>
          </Link>
          <Link to={"/news/create"} className="link">
            <div className="link-container">
              <p>Add a Featured Story</p>
              <div className="icon">+</div>
            </div>
          </Link>
          <Link to={"/news/create"} className="link">
            <div className="link-container">
              <p>Create a new Ad</p>
              <div className="icon">+</div>
            </div>
          </Link>
          <Link to={"/news/create"} className="link">
            <div className="link-container">
              <p>Create a new Topic</p>
              <div className="icon">+</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
