import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import { Link } from "react-router-dom";
import "./../../styles/Heading.scss";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import Delete from "./../Modals/Delete";

const Occupation = () => {
  const [data, setData] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await Axios.get("/occupations");
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
          title={"Do you want to delete this occupation ?"}
          fetchData={fetchData}
          route={`/admin/occupations/${id}`}
          setIsDeleteOpen={setIsDeleteOpen}
          toastMessage="Occupations deleted successfully"
          toast={toast}
        />
      )}
      <div className="heading">
        <h3>Occupations</h3>
        <div className="heading-create">
          <Link className="link" to={"/occupation/create"}>
            Create an Occupation
          </Link>
          <input
            type="text"
            placeholder="Search for a keyword"
            className="form-control"
          />
        </div>
      </div>
      <table className="table my-5">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            return (
              <tr scope="row" key={item.id}>
                <td>{sn++}</td>
                <td>{item.name}</td>
                <td className="d-flex gap-3">
                  <Link
                    to={`/occupation/create/${item.id}`}
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
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Occupation;
