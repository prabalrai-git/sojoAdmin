import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import "./../../styles/Heading.scss";
import "./../../styles/Form.scss";
import { Button, DatePicker, Select, Tag } from "antd";
import moment from "moment-timezone";
import { Table, Input } from "antd";
import { Link } from "react-router-dom";
import "./index.css";
import dayjs from "dayjs";
import ActiveDisplay from "./ActiveDisplay";
import IntegerStep from "./IntegerStep";
import { CSVLink, CSVDownload } from "react-csv";
const { RangePicker } = DatePicker;

const UsersByActivity = () => {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [totalActiveUsers, setTotalActiveUsers] = useState();
  const [allUsers, setAllUsers] = useState();
  const [reRender, setReRender] = useState(false);
  const [activeDaysFilter, setActiveDaysFilter] = useState(null);
  const [pages, setPages] = useState(10);
  const [csvData, setCSVData] = useState();
  const [filteredDataNumber, setFilteredDataNumber] = useState();

  // useEffect(() => {
  //   setTotalUsers(filteredData?fildata.length);
  // }, [data]);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so we add 1 and pad with leading zero if needed
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    setStartDate(today);
    setEndDate(today);
  }, []);
  const onActiveDaysSelected = (e) => {
    const inputValue = e.target.value;
    setActiveDaysFilter(inputValue);

    if (inputValue.trim() === "") {
      // Reset to the initial state if the input is empty
      // setData(allUsers);
      getUsersByDateRangeForActivity();
    } else {
      // Filter and sort the data based on the input value
      const filteredData = data.filter(
        (item) =>
          // String(item.activeDays).includes(inputValue)
          Number(item.activeDays) >= Number(inputValue)
      );

      const sortedData = filteredData
        .slice()
        .sort((a, b) => a.activeDays - b.activeDays);

      setData(sortedData);
    }
  };

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        let i = 1;
        const slicedData = data.slice(0, pages + 1);
        const csvData = slicedData.map((item) => {
          return {
            SN: i++,
            Name: item?.username,
            Email: item?.email,
            ActiveDays: item?.activeDays ? item.activeDays : 0,
          };
        });
        setCSVData(csvData);
      }, 500);
    }
  }, [data, pages]);

  // const getUserActivityOverTime = async (userId) => {
  //   try {
  //     const response = await Axios.get(
  //       `/users/profile/getUserActivity?userId=${userId}`
  //     );
  //     return response.data.data.length;
  //   } catch (error) {}

  // };

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
      title: "Active Days",

      render: (text, record) => {
        return <ActiveDisplay id={record.id} data={data} />;
      },
      // sorter: async (a, b) => {
      //   console.log(a);
      // },
    },

    {
      title: "Active",
      dataIndex: "userIsActiveToday",
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
      onFilter: (value, record) => record.userActivityActive === value,
      filterSearch: true,

      render: (index, item) =>
        item?.userActivityActive ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Tag color="green">Yes</Tag>
            <Link to={`/userActivity/${item?.id}`} className="link">
              <Button type="primary" size={"small"} onClick={() => {}}>
                View More
              </Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Tag color="red">No</Tag>
            <Link to={`/userActivity/${item?.id}`} className="link">
              <Button type="primary" size={"small"}>
                View More
              </Button>
            </Link>
          </div>
        ),
    },
  ];

  //

  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      setData();
      getUsersByDateRangeForActivity();
    }
  }, [startDate, endDate, allUsers, reRender]);

  function removeDuplicates(array) {
    const seenIds = new Set();

    return array.filter((object) => {
      if (seenIds.has(object.id)) {
        return false;
      }

      seenIds.add(object.id);

      return true;
    });
  }

  const getUsersByDateRangeForActivity = async () => {
    try {
      const res = await Axios.get(
        `/users/profile/getUserActivity?startDate=${startDate}&endDate=${endDate}`
      );
      const data = res.data.data;

      let users = [];
      // console.log(data);
      for (let i in data) {
        if (data[i].user) {
          users.push({
            ...data[i].user,
            userActivityActive: data[i].isActive,
          });
        }
      }
      const totalUsers = users?.map((item, index) => {
        return allUsers?.map((user) => {
          if (item.id !== user.id) {
            return { ...user, userActivityActive: false };
          }
        });
      });
      const filteredTotalUsers = totalUsers[0]?.filter(
        (item) => item !== undefined || null
      );
      const mergedUsers = [...users, ...filteredTotalUsers];
      users.push(mergedUsers);
      const removedDuplicateMergedUsers = removeDuplicates(mergedUsers);

      const numberAddedData = removedDuplicateMergedUsers.map((item, index) => {
        return { ...item, SN: index + 1 };
      });

      setData(numberAddedData);

      setTotalActiveUsers(users.length - 1);
    } catch (error) {
      console.log(error);
    }
  };

  // const getUserActivityOverTime = async (id) => {
  //   try {
  //     const response = await Axios.get(
  //       `/users/profile/getUserActivity?userId=${id}`
  //     );
  //     // console.log("hi", response.data.data);
  //     return response.data.data.length;
  //   } catch (error) {}
  // };
  const dateFormat = "YYYY-MM-DD";

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

      // console.log(res.data.data, "hi");
      setAllUsers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    config && fetchData();
  }, [config]);

  return (
    <>
      <div
        className="heading"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h3>Users By Activity</h3>
        <div className="heading-create">
          {/* <Link className="link" to={"/occupation/create"}>
            Create an Occupation
          </Link> */}
          {/* <div> */}

          <Input
            onChange={onActiveDaysSelected}
            value={activeDaysFilter}
            style={{ minWidth: 280 }}
            placeholder="Filter greater or equals to active days.."
            maxLength={16}
          />

          {/* <IntegerStep
            onActiveDaysSelected={onActiveDaysSelected}
            activeDaysFilter={activeDaysFilter}
          /> */}
          <RangePicker
            disabledDate={(current) => {
              let customDate = moment().format("YYYY-MM-DD");
              return current && current > moment(customDate, "YYYY-MM-DD");
            }}
            defaultValue={[
              dayjs(formattedDate, dateFormat),
              dayjs(formattedDate, dateFormat),
            ]}
            format={dateFormat}
            onChange={
              (e) => {
                e && setStartDate(moment(e[0]?.$d).format("YYYY-MM-DD"));
                e && setEndDate(moment(e[1]?.$d).format("YYYY-MM-DD"));
              }
              // console.log(
              //   moment(e[0].$d).format("MM/DD/YYYY"),
              //   moment(e[1].$d).format("MM/DD/YYYY")
              // )
            }
            style={{ width: "100%", marginLeft: "5%", height: 46 }}
            // format="YYYY-MM-DD HH:mm"
          />
          {csvData && (
            <CSVLink
              data={csvData}
              style={{
                backgroundColor: "#26B160",
                width: 330,
                height: 46,
                display: "flex",
                // paddingLeft: 30,
                // paddingRight:10
                justifyContent: "center",
                alignItems: "center",
                textDecoration: "none",
                color: "white",
                borderRadius: 5,
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              Excel Export
            </CSVLink>
          )}
          {/* </div> */}
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
        </div>
      </div>

      <p
        style={{
          fontWeight: "normal",
          // textDecoration: "underline",
          fontSize: 14,
          marginBottom: 5,
          marginTop: 10,
        }}
      >
        Total Users Count :
        <span style={{ color: "black", fontWeight: "bold", marginLeft: 4 }}>
          {allUsers?.length}
        </span>
      </p>
      <p
        style={{
          fontWeight: "normal",
          // textDecoration: "underline",
          fontSize: 14,
          marginBottom: 5,
        }}
      >
        Active Users Count :
        <span style={{ color: "#26B160", fontWeight: "bold", marginLeft: 4 }}>
          {totalActiveUsers}
        </span>
      </p>
      <p
        style={{
          fontWeight: "normal",
          // textDecoration: "underline",
          fontSize: 14,
          marginBottom: 10,
        }}
      >
        In-Active Users Count :
        <span style={{ color: "red", fontWeight: "bold", marginLeft: 4 }}>
          {Number(allUsers?.length) - Number(totalActiveUsers)}
        </span>
      </p>
      <p
        style={{
          fontWeight: "normal",
          // textDecoration: "underline",
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        Count After filter Applied :
        <span style={{ color: "blue", fontWeight: "bold", marginLeft: 4 }}>
          {filteredDataNumber}
        </span>
      </p>
      <Table
        pagination={{
          pageSize: pages,
          onChange: (e, a) => setPages(a),
          showTotal: (e, a) => setFilteredDataNumber(e),
        }}
        columns={columns}
        dataSource={data}
        // pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default UsersByActivity;
