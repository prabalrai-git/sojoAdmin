import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import "./../../styles/Heading.scss";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import Delete from "./../Modals/Delete";
import { DatePicker } from "antd";
import moment from "moment-timezone";
import { Table } from "antd";
const { RangePicker } = DatePicker;

const Users = () => {
  const [data, setData] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(null);
  const [config, setConfig] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState();
  const [changed, setChanged] = useState(false);
  const [states, setStates] = useState([]);

  console.log(data);

  const columns = [
    {
      title: "S.N",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Name",
      dataIndex: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),

      // width: "30%",
    },
    {
      title: "Email",
      dataIndex: "email",
      // sorter: (a, b) => a.email?.length - b.email?.length,
    },
    {
      title: "State",
      dataIndex: "stateId",
      render: (index, item) =>
        item.stateId
          ? states?.map((watup) => {
              if (item.stateId === watup.id) {
                return watup.name;
              }
            })
          : "n/a",

      // width: "40%",
    },
    {
      title: "Skipped NSFW",
      dataIndex: "skipNSFW",
      filters: [
        {
          text: "Yes",
          value: true,
        },
        {
          text: "No",
          value: false,
        },
      ],
      render: (index, item) => (item.skipNSFW ? "Yes" : "No"),
      onFilter: (value, record) => record.skipNSFW === value,
      filterSearch: true,
      // width: "40%",
    },
    {
      title: "Skipped Politics ",
      dataIndex: "skipPolitical",
      filters: [
        {
          text: "Yes",
          value: true,
        },
        {
          text: "No",
          value: false,
        },
      ],
      render: (index, item) => (item.skipPolitical ? "Yes" : "No"),
      onFilter: (value, record) => record.skipPolitical === value,
      filterSearch: true,
      // width: "40%",
    },
  ];
  // const dataD = [
  //   {
  //     key: "1",
  //     name: "John Brown",
  //     age: 32,
  //     address: "New York No. 1 Lake Park",
  //   },
  //   {
  //     key: "2",
  //     name: "Jim Green",
  //     age: 42,
  //     address: "London No. 1 Lake Park",
  //   },
  //   {
  //     key: "3",
  //     name: "Joe Black",
  //     age: 32,
  //     address: "Sydney No. 1 Lake Park",
  //   },
  //   {
  //     key: "4",
  //     name: "Jim Red",
  //     age: 32,
  //     address: "London No. 2 Lake Park",
  //   },
  // ];

  //

  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    getStates();
  }, []);

  const getStates = async () => {
    try {
      const res = await Axios.get("/states/getAllStates");

      setStates(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await Axios.get("/admin/users", config);

      const formattedData = res.data.data.map((item) => ({
        ...item,
        createdAt: moment(item.createdAt).format("YYYY-MM-DD"),
      }));

      setData(formattedData);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(data);

  useEffect(() => {
    config && fetchData();
  }, [config]);

  let sn = 1;

  function filterDataByDateRange(data, startDate, endDate) {
    return data.filter((item) => {
      const itemDate = item.createdAt;

      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  useEffect(() => {
    if (data && startDate && endDate) {
      const filteredData = filterDataByDateRange(data, startDate, endDate);
      setFilteredData(filteredData);
    }
  }, [changed]);

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
          <div>
            <RangePicker
              onChange={
                (e) => {
                  setStartDate(moment(e[0].$d).format("YYYY-MM-DD"));
                  setEndDate(moment(e[1].$d).format("YYYY-MM-DD"));
                  setChanged((prev) => !prev);
                }
                // console.log(
                //   moment(e[0].$d).format("MM/DD/YYYY"),
                //   moment(e[1].$d).format("MM/DD/YYYY")
                // )
              }
              style={{ width: 321, height: 46 }}
              // format="YYYY-MM-DD HH:mm"
            />
          </div>
          <input
            type="text"
            placeholder="Search for a keyword"
            className="form-control"
          />
        </div>
      </div>
      <table className="table my-5">
        {/* <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">State</th>
            <th scope="col">Skipped NSFW</th>
            <th scope="col">Skipped Politics</th>
          </tr>
        </thead> */}
        {/* <tbody>
          {filteredData
            ? filteredData.map((item) => {
                return (
                  <tr scope="row" key={item.id}>
                    <td>{sn++}</td>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>
                      {item.stateId
                        ? states?.map((watup) => {
                            if (item.stateId === watup.id) {
                              return watup.name;
                            }
                          })
                        : "n/a"}
                    </td>
                    <td>{item.skipNSFW ? "Yes" : "No"}</td>
                    <td>{item.skipPolitical ? "Yes" : "No"}</td> */}

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
        {/* </tr>
                );
              })
            : data.map((item) => {
                return (
                  <tr scope="row" key={item.id}>
                    <td>{sn++}</td>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>
                      {item.stateId
                        ? states?.map((watup) => {
                            if (item.stateId === watup.id) {
                              return watup.name;
                            }
                          })
                        : "n/a"}
                    </td>
                    <td>{item.skipNSFW ? "Yes" : "No"}</td>
                    <td>{item.skipPolitical ? "Yes" : "No"}</td> */}

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
        {/* </tr>
                );
              })}
        </tbody> */}
      </table>
      <Table
        columns={columns}
        dataSource={filteredData ? filteredData : data}
        // pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default Users;
