import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "./../../api/server";
import { Table, Tag } from "antd";

function UserActivity() {
  const [data, setData] = useState();
  let { userId } = useParams();

  useEffect(() => {
    getUserActivityOverTime();
  }, []);

  const getUserActivityOverTime = async () => {
    try {
      const response = await Axios.get(
        `/users/profile/getUserActivity?userId=${userId}`
      );
      setData(response.data.data);
    } catch (error) {}
  };

  const columns = [
    {
      title: "S.N",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Date",
      dataIndex: "date",

      // width: "30%",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: () => <Tag color="green">Yes</Tag>,
      // sorter: (a, b) => a.email?.length - b.email?.length,
    },
  ];

  return (
    <>
      <h3>User Activity over time:</h3>
      <Table
        columns={columns}
        dataSource={data}
        // pagination={{ pageSize: 10 }}
      />
    </>
  );
}

export default UserActivity;
