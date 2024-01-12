import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import { Link } from "react-router-dom";
import "./../../styles/Heading.scss";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import Delete from "./../Modals/Delete";
import moment from "moment";
import { DatePicker, Space, Table, Tag } from "antd";

const News = () => {
  const [data, setData] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [config, setConfig] = useState(null);
  const [datefilteredData, setDatefilteredData] = useState();
  const [dateRange, setDateRange] = useState();

  const { RangePicker } = DatePicker;

  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }, []);

  const sendPushNotification = async (item) => {
    const topics = [];

    for (let x in item.topics) {
      // console.log(item.topics[x].name);
      topics.push(item.topics[x].name);
    }

    const data = {
      title: item.title,
      previewText: item.previewText,
      image: item.image,
      topics: topics,
      id: item.id,
    };

    // return console.log(data);
    try {
      const res = await Axios.post(
        "admin/news/sendPushNotification",
        data,
        config
      );
      toast.success("Push Notification sent successfully");
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  const fetchData = async () => {
    try {
      const res = await Axios.get(
        `/admin/news?page=${page}&search=${search}&limit=200`,
        config
      );
      if (!search) {
        data.length > 0
          ? setData((prevData) => [...prevData, ...res.data.data])
          : setData(res.data.data);
      } else {
        data.length > 0
          ? setData((prevData) => [...prevData, ...res.data.data])
          : setData(res.data.data);
      }

      setHasMore(res.data.pagination.nextPage !== null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (config) {
      // Call fetchData with page and search values
      fetchData(page);

      // If search value has changed, wait for 2 seconds before fetching data again
      if (search) {
        setData([]);
        const timer = setTimeout(() => {
          setData([]);
          fetchData(1);
        }, 2000);

        // Clear timer when the component is unmounted or search value changes again
        return () => clearTimeout(timer);
      }
    }
  }, [page, search, config]);

  let sn = 1;

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (dateRange) {
      getDateFilteredData(dateRange[0], dateRange[1]);
    }
  }, [dateRange, page]);

  const getDateFilteredData = async (startDate, endDate) => {
    try {
      const res = await Axios.get(
        `/admin/news/getNews/getNewsByDateRange?startDate=${startDate}&endDate=${endDate}&page=${page}`
      );
      datefilteredData?.length > 0
        ? setDatefilteredData((prevData) => [...prevData, ...res.data.data])
        : setDatefilteredData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      render: (a, b, c) => <>{sn++}</>,
    },
    {
      title: "News Details",
      dataIndex: "image",
      key: "image",
      width: "50%",
      render: (item, allitem) => {
        return (
          <td className="details-wrapper">
            <img
              src={item}
              style={{ width: 125, height: 95 }}
              alt=""
              className="thumbnail"
            />
            <div className="details">
              <h6>{allitem?.title}</h6>
              <p>{allitem?.previewText}</p>
            </div>
          </td>
        );
      },
    },
    {
      title: "Categories",
      dataIndex: "topics",
      key: "topics",
      render: (item) => {
        return (
          <td>
            <div className="d-flex gap-1">
              {item
                ?.sort((a, b) => a.news_topic.order - b.news_topic.order)
                .map((item) => {
                  return (
                    <button className="btn btn-secondary p-1" key={item.id}>
                      <span className="badge badge-primary">{item.name}</span>
                    </button>
                  );
                })}
            </div>
          </td>
        );
      },
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      width: "100px",
      sorter: (a, b) => a.views - b.views,
      render: (item) => <td>{item} Views</td>,
    },
    {
      title: "Written Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (item) => (
        <td>
          {moment(item).format("MMM Do YYYY h:mm a")} <br />
        </td>
      ),
    },

    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <td style={{ display: "flex", gap: 10 }}>
          <Link to={`/news/create/${record.id}`} className="btn btn-primary ">
            Edit
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => {
              setIsDeleteOpen(true);
              setId(record.id);
            }}
          >
            Delete
          </button>
          <button
            className="btn btn-success"
            style={{ marginLeft: 10, width: 200 }}
            onClick={() => {
              sendPushNotification(record);
            }}
          >
            Send Push Notifications
          </button>
        </td>
      ),
    },
  ];

  return (
    <>
      <div className="heading">
        <h3>Created News</h3>
        <div className="heading-create">
          <Link className="link" to={"/news/create"}>
            Add News
          </Link>
          <input
            type="text"
            placeholder="Search for a keyword"
            className="form-control"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <RangePicker
            allowClear={false}
            onChange={(a, e) => {
              setDatefilteredData([]);
              setPage(1);

              setDateRange(e);
            }}
            size={"middle"}
          />
        </div>
      </div>
      <Table
        style={{ marginTop: 50 }}
        columns={columns}
        dataSource={datefilteredData ? datefilteredData : data}
        scroll={{
          x: 1400,
        }}
        pagination={{
          showSizeChanger: true,

          defaultPageSize: 10,
          // onChange: () => handleLoadMore(),
        }}
      />
      {/* {hasMore && (
        <button
          // className="my-5"
          style={{ position: "relative", top: -55 }}
          onClick={handleLoadMore}
        >
          Load More
        </button>
      )} */}
      <ToastContainer />
      {id && isDeleteOpen && (
        <Delete
          title={"Do you want to delete this news ?"}
          fetchData={fetchData}
          route={`/admin/news/${id}`}
          setIsDeleteOpen={setIsDeleteOpen}
          toastMessage="News deleted successfully"
          toast={toast}
        />
      )}
    </>
  );

  return (
    <div className="table-responsive text-nowrap">
      <table className="table my-5">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">News Details</th>
            <th scope="col">Categories</th>
            <th scope="col">Views</th>
            <th scope="col">Written Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody style={{ verticalAlign: "middle" }}>
          {datefilteredData
            ? datefilteredData.map((item) => {
                return (
                  <tr scope="row" key={item.id} className="">
                    <td>{sn++}</td>
                    <td className="details-wrapper">
                      <img src={item.image} alt="" className="thumbnail" />
                      <div className="details">
                        <h5>{item.title}</h5>
                        <p>{item.previewText}</p>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex gap-1">
                        {item.topics
                          ?.sort(
                            (a, b) => a.news_topic.order - b.news_topic.order
                          )
                          .map((item) => {
                            return (
                              <button
                                className="btn btn-secondary p-1"
                                key={item.id}
                              >
                                <span className="badge badge-primary">
                                  {item.name}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </td>

                    <td>{item.views} Views</td>

                    <td>
                      {moment(item.createdAt).format("MMM Do YYYY h:mm:ss a")}{" "}
                      <br />
                      <span className="text-success">
                        {/* {moment(item.updatedAt).format("MMM Do YYYY h:mm:ss a")}{" "} */}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/news/create/${item.id}`}
                        className="btn btn-primary "
                      >
                        Edit
                      </Link>{" "}
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setIsDeleteOpen(true);
                          setId(item.id);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-success"
                        style={{ marginLeft: 10 }}
                        onClick={() => {
                          sendPushNotification(item);
                        }}
                      >
                        Send Push Notifications
                      </button>
                    </td>
                  </tr>
                );
              })
            : data.map((item) => {
                return (
                  <tr scope="row" key={item.id} className="">
                    <td>{sn++}</td>
                    <td className="details-wrapper">
                      <img src={item.image} alt="" className="thumbnail" />
                      <div className="details">
                        <h5>{item.title}</h5>
                        <p>{item.previewText}</p>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex gap-1">
                        {item.topics
                          ?.sort(
                            (a, b) => a.news_topic.order - b.news_topic.order
                          )
                          .map((item) => {
                            return (
                              <button
                                className="btn btn-secondary p-1"
                                key={item.id}
                              >
                                <span className="badge badge-primary">
                                  {item.name}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </td>

                    <td>{item.views} Views</td>

                    <td>
                      {moment(item.createdAt).format("MMM Do YYYY h:mm:ss a")}{" "}
                      <br />
                      <span className="text-success">
                        {/* {moment(item.updatedAt).format("MMM Do YYYY h:mm:ss a")}{" "} */}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/news/create/${item.id}`}
                        className="btn btn-primary "
                      >
                        Edit
                      </Link>{" "}
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setIsDeleteOpen(true);
                          setId(item.id);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-success"
                        style={{ marginLeft: 10 }}
                        onClick={() => {
                          sendPushNotification(item);
                        }}
                      >
                        Send Push Notifications
                      </button>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
};

export default News;
