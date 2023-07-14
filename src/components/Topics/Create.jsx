import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

const CreateTopic = () => {
  const [name, setName] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const { topicId } = useParams();
  const [image, setImage] = useState(null);
  const [displayImage, setDisplayImage] = useState("");
  const navigate = useNavigate();
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
        const res = await Axios.get(`/topics/${topicId}`);
        setId(res.data.data.id);
        setName(res.data.data.name);
        setDisplayImage(res.data.data.image);
        setImage(res.data.data.image);
      } catch (err) {
        console.log(err);
        if (err.response.data.status === 404) {
          navigate("/topics");
        }
      }
    };
    topicId && fetchData();
  }, [topicId]);

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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    try {
      if (id) {
        await Axios.patch(`/admin/topics/${id}`, formData, config);
        toast.success("Topic Updated");
      } else {
        await Axios.post("/admin/topics", formData, config);
        setName("");
        setImage(null);
        setDisplayImage("");
        toast.success("Topic Created");
      }
      window.scrollTo(0, 0);
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
      <h3>{id ? "Update Topic" : "Create a Topic"}</h3>
      <form className="mt-3" onSubmit={handleFormSubmit}>
        <div className="input-wrapper">
          <label htmlFor="name">Topic Name</label>
          <input
            type={"text"}
            className="form-control mt-2 p-2"
            value={name}
            placeholder="Enter topic name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="input-wrapper" style={{ marginTop: "1rem" }}>
          <input
            type="file"
            name="image"
            onChange={(e) => {
              const img = URL.createObjectURL(e.target.files[0]);
              setDisplayImage(img);
              setImage(e.target.files[0]);
            }}
          />
        </div>

        {displayImage && (
          <div className="display-img">
            <img
              src={displayImage}
              alt=""
              onClick={() => {
                setImage(null);
                setDisplayImage("");
              }}
            />
          </div>
        )}
        <button disabled={loading} className="mt-4">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </>
  );
};

export default CreateTopic;
