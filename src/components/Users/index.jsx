import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import "./../../styles/Heading.scss";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import Delete from "./../Modals/Delete";

const Users = () => {
  const [data, setData] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(null);
  const [config, setConfig] = useState(null);
  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }, []);

  const fetchData = async () => {
    try {
      const res = await Axios.get("/admin/users", config);
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    config && fetchData();
  }, [config]);

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
        <h3>Users</h3>
        <div className="heading-create">
          {/* <Link className="link" to={"/occupation/create"}>
            Create an Occupation
          </Link> */}
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
            <th scope="col">email</th>
            {/* <th scope="col">Phone Number</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            return (
              <tr scope="row" key={item.id}>
                <td>{sn++}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                {/* <td>{item.phone}</td> */}
                {/* <td className="d-flex gap-3">
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
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Users;
