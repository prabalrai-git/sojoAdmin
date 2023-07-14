import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Title = () => {
  const [title, setTitle] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(`/admin/title/`);
        setTitle(res.data.data.title);
      } catch (err) {
        console.log(err);
      }
    };
    config && fetchData();
  }, []);

  useEffect(() => {
    if (err) {
      toast.error(err, {
        theme: "colored",
      });
      setErr(null);
    }
  }, [err]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { title };
    try {
      await Axios.post(`/admin/title/`, data, config);
      toast.success("Title Updated");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setErr(err.response.data.err);
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <h3>Update Title</h3>
      <form className="mt-3" onSubmit={handleFormSubmit}>
        <div className="input-wrapper">
          <label htmlFor="name">Title</label>
          <ReactQuill
            theme="snow"
            value={title}
            onChange={setTitle}
            style={{
              backgroundColor: "#fff",
            }}
          />
        </div>
        <button disabled={loading} className="mt-4">
          Update
        </button>
      </form>
    </>
  );
};

export default Title;
