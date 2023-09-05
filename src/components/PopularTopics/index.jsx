import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import { Link } from "react-router-dom";
import "./../../styles/Heading.scss";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import Delete from "./../Modals/Delete";

const PopularTopics = () => {
  const [data, setData] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await Axios.get("/admin/topics/getTopicsByPopularity");
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  let sn = 1;

  return (
    <>
      <ToastContainer />
      {id && isDeleteOpen && (
        <Delete
          title={"Do you want to delete this topic ?"}
          fetchData={fetchData}
          route={`/admin/topics/${id}`}
          setIsDeleteOpen={setIsDeleteOpen}
          toastMessage="Topic deleted successfully"
          toast={toast}
        />
      )}
      <div className="heading">
        <h3>Popular Topics</h3>
        {/* <div className="heading-create">
          <Link className="link" to={"/topics/create"}>
            Create a Topic
          </Link>
          <input
            type="text"
            placeholder="Search for a keyword"
            className="form-control"
          />
        </div> */}
      </div>
      <table className="table my-5">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Subscribed Users</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            return (
              <tr scope="row" key={item.id}>
                <td>{sn++}</td>
                <td>{item.name}</td>
                <td>
                  {/* <Link
                    to={`/topics/create/${item.id}`}
                    className="btn btn-primary"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setIsDeleteOpen(true);
                      setId(item.id);
                    }}
                  >
                    Delete
                  </button> */}
                  {item.repetition_count}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default PopularTopics;
