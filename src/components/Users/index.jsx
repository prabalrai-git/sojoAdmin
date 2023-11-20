import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import "./../../styles/Heading.scss";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import Delete from "./../Modals/Delete";
import { Button, DatePicker, Select, Tag } from "antd";
import moment from "moment-timezone";
import { Table } from "antd";
import { Link } from "react-router-dom";
import "./index.css";
import dayjs from "dayjs";

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
  const [statesSelect, setStatesSelect] = useState([]);
  const [totalUsers, setTotalUsers] = useState();
  const [allOccupation, setAllOccupation] = useState();

  useEffect(() => {
    setTotalUsers(filteredData ? filteredData?.length : data?.length);
  }, [data, filteredData]);

  const resetBtnClicked = () => {
    setData();
    setFilteredData();
    fetchData();
  };

  const getAllOccupation = async () => {
    try {
      const response = await Axios.get("/occupations");

      setAllOccupation(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(allOccupation);
  const columns = [
    {
      title: "S.N",
      dataIndex: "SN",
      // render: (text, record, index) => {
      //   return index + 1;
      // },
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
        item?.stateId
          ? states?.map((watup) => {
              if (item?.stateId === watup.id) {
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
      render: (index, item) => (item?.skipNSFW ? "Yes" : "No"),
      onFilter: (value, record) => record?.skipNSFW === value,
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
      render: (index, item) => (item?.skipPolitical ? "Yes" : "No"),
      onFilter: (value, record) => record?.skipPolitical === value,
      filterSearch: true,
      // width: "40%",
    },
    {
      title: "Occupation",
      dataIndex: "occupationId",
      filters: [
        {
          text: "Student",
          value: 1,
        },
        {
          text: "Employee",
          value: 2,
        },
        {
          text: "Employer",
          value: 3,
        },
        {
          text: "Business Owner",
          value: 4,
        },
        {
          text: "Others",
          value: 5,
        },
      ],
      render: (index, item) =>
        item?.occupationId
          ? allOccupation?.map((watup) => {
              if (item?.occupationId === watup.id) {
                return watup.name;
              }
            })
          : "n/a",

      onFilter: (value, record) => record?.occupationId === value,
      filterSearch: true,

      // width: "40%",
    },
  ];
  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    getStates();
    getAllOccupation();
  }, []);

  const getStates = async () => {
    try {
      const res = await Axios.get("/states/getAllStates");

      const selectStates = res.data.data.map((item) => {
        return { value: item.id, label: item.name };
      });

      setStatesSelect(selectStates);

      setStates(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await Axios.get("/admin/users", config);

      const formattedData = res.data.data.map((item, index) => ({
        ...item,
        createdAt: moment(item.createdAt).format("YYYY-MM-DD"),
        SN: index + 1,
      }));

      setData(formattedData);
    } catch (err) {
      console.log(err);
    }
  };

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
  }, [changed, startDate, endDate]);
  let customDate = moment().format("YYYY-MM-DD");

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so we add 1 and pad with leading zero if needed
  const day = String(today.getDate()).padStart(2, "0");

  const onChange = (value) => {
    setFilteredData([]);
    const stateFilteredData = data?.filter((item) => {
      return Number(item?.stateId) === Number(value);
    });

    setFilteredData(stateFilteredData);
  };

  const onSearch = (value) => {};
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

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
        <div className="heading-create" style={{ flex: 0.7 }}>
          {/* <Link className="link" to={"/occupation/create"}>
            Create an Occupation
          </Link> */}
          <div>
            <RangePicker
              disabledDate={(current) => {
                const nextDay = moment().add(1, "day").startOf("day"); // Get the start of the next day

                // Allow today's date and disable dates in the future
                return current && current >= nextDay;
              }}
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
          {/* <div>
            <Select
              style={{ width: 200 }}
              placeholder="Select user activity"
              optionFilterProp="children"
              onChange={(e) => setActivityFilter(e)}
              // filterOption={filterOption}
              options={[
                {
                  value: "Active",
                  label: "Active",
                },
                {
                  value: "Inactive",
                  label: "Inactive",
                },
                {
                  value: null,
                  label: "All",
                },
              ]}
            />
          </div> */}

          {/* <input
            type="text"
            placeholder="Search for a keyword"
            className="form-control"
            style={{ width: 200 }}
          /> */}
          <Select
            showSearch
            placeholder="Select a state"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            allowClear
            options={statesSelect}
            style={{ width: 210 }}
          />
          <button onClick={() => resetBtnClicked()}>Reset</button>
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
      <p
        style={{
          // fontWeight: "bold",
          fontSize: 18,
        }}
      >
        Total Number Of Users :
        <span style={{ color: "#26B160", fontWeight: "bold" }}>
          {totalUsers}
        </span>
      </p>
      <Table
        columns={columns}
        dataSource={filteredData ? filteredData : data}
        // pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default Users;
