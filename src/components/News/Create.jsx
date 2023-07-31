import { useState, useEffect } from "react";
import Axios from "./../../api/server";
import { toast, ToastContainer } from "react-toastify";
import "./../../styles/Form.scss";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const CreateTopic = () => {
  const [title, setTitle] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNSFW, setIsNSFW] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [sponsorURL, setSponorURL] = useState("");
  const [topic, setTopic] = useState("");
  const [occupation, setOccupation] = useState("");
  const [states, setStates] = useState([]);
  const [state, setState] = useState();
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [news, setNews] = useState("");
  const [nepaliNews, setNepaliNews] = useState("");
  const [image, setImage] = useState(null);
  const [displayImage, setDisplayImage] = useState("");
  const [titleNews, setTitleNews] = useState([]);

  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const { newsId } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [config, setConfig] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }, []);

  // fetch topics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const arr = [];
        const res = await Axios.get("/topics");
        res.data.data.forEach((item) => {
          arr.push({
            value: item.id,
            label: item.name,
          });
        });
        setTopics(arr);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const arr = [];
        const res = await Axios.get("/states/getAllStates");
        res.data.data.forEach((item) => {
          arr.push({
            value: item.id,
            label: item.name,
          });
        });

        setStates(arr);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // console.log(states);

  // fetch occupations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const arr = [];
        const res = await Axios.get("/occupations");
        res.data.data.forEach((item) => {
          arr.push({
            value: item.id,
            label: item.name,
          });
        });
        setOccupations(arr);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(`/admin/news/${newsId}`, config);
        const topicArr = [];
        const occupationArr = [];
        const ageGroupArr = [];
        const genderArr = [];
        const stateArr = [];

        console.log(res.data.data);

        res.data.data.topics
          .sort((a, b) => a.news_topic.order - b.news_topic.order)
          .forEach((item) => {
            topicArr.push({
              label: item.name,
              value: item.id,
            });
          });

        res.data.data.occupations.forEach((item) => {
          occupationArr.push({
            label: item.name,
            value: item.id,
          });
        });

        if (typeof res.data.data.ageGroup === "object") {
          res.data.data.ageGroup.forEach((item) => {
            ageGroupArr.push({
              label: item,
              value: item,
            });
          });
        } else {
          ageGroupArr.push({
            label: res.data.data.ageGroup,
            value: res.data.data.ageGroup,
          });
        }

        if (typeof res.data.data.gender === "object") {
          res.data.data.gender.forEach((item) => {
            genderArr.push({
              label: item,
              value: item,
            });
          });
        } else {
          genderArr.push({
            label: res.data.data.gender,
            value: res.data.data.gender,
          });
        }

        if (typeof res.data.data.states === "object") {
          res.data.data.states.forEach((item) => {
            stateArr.push({
              label: states.map((e) => {
                if (e.value === Number(item)) return e.label;
              }),
              value: item,
            });
          });
        } else {
          stateArr.push({
            label: states.map((e) => {
              if (e.value === Number(res.data.data.states)) return e.label;
            }),
            value: res.data.data.states,
          });
        }

        setId(res.data.data.id);
        setTitle(res.data.data.title);
        setPreviewText(res.data.data.previewText);
        setNews(res.data.data.news);
        setTopic(topicArr);
        setOccupation(occupationArr);
        setAgeGroup(ageGroupArr);
        setGender(genderArr);
        setIsFeatured(res.data.data.isFeatured);
        setIsNSFW(res.data.data.isNSFW);
        setIsPaid(res.data.data.isPaid);
        setSponorURL(res.data.data.sponsorURL);
        setDisplayImage(res.data.data.image);
        setImage(res.data.data.image);
        setState(stateArr);
      } catch (err) {
        console.log(err);
        if (err.response.data.status === 404) {
          navigate("/news");
        }
      }
    };
    config && newsId && fetchData();
  }, [newsId, config, states]);

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
    if (sizeError) {
      return console.log("size Error");
    } else {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", title);
      formData.append("previewText", previewText);
      formData.append("news", news);
      topic &&
        topic?.forEach((item) => {
          formData.append("topic", item.value);
        });

      ageGroup &&
        ageGroup?.forEach((item) => {
          formData.append("ageGroup", item.value);
        });

      gender &&
        gender?.forEach((item) => {
          formData.append("gender", item.value);
        });

      occupation &&
        occupation?.forEach((item) => {
          formData.append("occupation", item.value);
        });
      state &&
        state?.forEach((item) => {
          formData.append("states", item.value);
        });

      formData.append("isFeatured", isFeatured);
      formData.append("isNSFW", isNSFW);
      formData.append("isPaid", isPaid);
      formData.append("sponsorURL", sponsorURL);
      formData.append("image", image);

      // return console.log(...formData);

      try {
        if (id) {
          await Axios.patch(`/admin/news/${id}`, formData, config);

          toast.success("News Updated");
        } else {
          await Axios.post("/admin/news", formData, config);
          // console.log(res);
          setTitle("");
          setPreviewText("");
          setSponorURL("");
          setNews("");
          setDisplayImage("");
          setImage(null);
          setTopic([]);
          setOccupation([]);
          setAgeGroup([]);
          setGender([]);
          setState([]);
          toast.success("News Created");
        }
        window.scrollTo(0, 0);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setErr(err.response.data.err);
      }
    }
  };

  const genderOptions = [
    {
      value: "*",
      label: "All",
    },
    {
      value: "Male",
      label: "Male",
    },
    {
      value: "Female",
      label: "Female",
    },
    {
      value: "Others",
      label: "Others",
    },
  ];

  const handleGenderSelectAll = () => {
    if (gender.length === genderOptions.length - 1) {
      setGender([]);
    } else {
      setGender(genderOptions.filter((option) => option.value !== "*"));
    }
  };

  const ageOptions = [
    {
      value: "*",
      label: "All",
    },
    {
      value: "14-20",
      label: "14-20",
    },
    {
      value: "21-35",
      label: "21-35",
    },
    {
      value: "36-50",
      label: "36-50",
    },
    {
      value: "51 & above",
      label: "51 & above",
    },
  ];

  const handleAgeSelectAll = () => {
    if (ageOptions.length === ageOptions.length - 1) {
      setAgeGroup([]);
    } else {
      setAgeGroup(ageOptions.filter((option) => option.value !== "*"));
    }
  };

  const searchTitle = async () => {
    try {
      const res = await Axios.get(`/admin/news/search/${title}`, config);
      setTitleNews(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (config) {
      const timer = setTimeout(() => {
        const searchWords = title.trim().split(/\s+/);
        if (searchWords.length >= 3) {
          searchTitle();
        } else {
          setTitleNews([]);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [title, config]);

  return (
    <>
      <ToastContainer theme="colored" />
      <h3>{id ? "Update News Story" : "Write a News Story"}</h3>
      <form className="mt-3" onSubmit={handleFormSubmit}>
        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper">
            <label htmlFor="name">
              News title in English{" "}
              {titleNews.length > 0 && (
                <span
                  style={{
                    color: "#FC7300",
                  }}
                >
                  {titleNews.length} News with similar title
                </span>
              )}
            </label>
            <input
              type={"text"}
              className="form-control mt-2 p-2"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <p className="text-muted mt-2">
              Suggested title length is 126 characters{" "}
              {title.length > 0 && `( ${title.length} characters )`}
            </p>
          </div>

          {/* <div className="input-wrapper">
            <label htmlFor="nepaliName">News title in Nepali</label>
            <input
              id="nepaliName"
              type={"text"}
              className="form-control mt-2 p-2"
              value={nepaliTitle}
              onChange={(e) => {
                setNepaliTitle(e.target.value);
              }}
            />
            <p className="text-muted mt-2">
              Suggested title length is 70 characters
            </p>
          </div> */}
        </div>

        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper">
            <label htmlFor="name">Preview text in English</label>
            <textarea
              className="form-control mt-2 p-2"
              value={previewText}
              rows={3}
              onChange={(e) => {
                setPreviewText(e.target.value);
              }}
            ></textarea>
            <p className="text-muted mt-2">
              {/* {previewText.length === 0
                ? "Suggested title length is 161 characters"
                : previewText.length + " words"} */}
              Suggested preview title length is 148 characters{" "}
              {previewText.length > 0 && `( ${previewText.length} characters )`}
            </p>
          </div>

          {/* <div className="input-wrapper">
            <label htmlFor="name">Preview text in Nepali</label>
            <textarea
              className="form-control mt-2 p-2"
              value={nepaliPreviewText}
              rows={3}
              onChange={(e) => {
                setNepaliPreviewText(e.target.value);
              }}
            ></textarea>
            <p className="text-muted mt-2">Limited to 250 characters</p>
          </div> */}
        </div>

        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper">
            <label htmlFor="name">News in English</label>
            <ReactQuill
              theme="snow"
              value={news}
              onChange={setNews}
              style={{
                backgroundColor: "#fff",
              }}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="name">News in Nepali</label>
            <ReactQuill
              theme="snow"
              value={nepaliNews}
              onChange={setNepaliNews}
              style={{
                backgroundColor: "#fff",
              }}
            />
          </div>
        </div>

        <div className="double-input-wrapper mb-4">
          <div className="input-wrapper">
            <label htmlFor="topic">Topic</label>
            <Select
              isMulti
              value={topic}
              options={[
                {
                  value: "*",
                  label: "All",
                },
                ...topics,
              ]}
              onChange={(selectedOptions) => {
                if (selectedOptions.some((option) => option.value === "*")) {
                  if (topic.length === topic.length - 1) {
                    setTopic([]);
                  } else {
                    setTopic(topics.filter((option) => option.value !== "*"));
                  }
                } else {
                  setTopic(selectedOptions);
                }
              }}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="ageGroup">Age Group</label>
            <Select
              isMulti
              value={ageGroup}
              options={[
                {
                  value: "*",
                  label: "All",
                },
                {
                  value: "14-20",
                  label: "14-20",
                },
                {
                  value: "21-35",
                  label: "21-35",
                },
                {
                  value: "36-50",
                  label: "36-50",
                },
                {
                  value: "51 & above",
                  label: "51 & above",
                },
              ]}
              onChange={(selectedOptions) => {
                if (selectedOptions.some((option) => option.value === "*")) {
                  handleAgeSelectAll();
                } else {
                  setAgeGroup(selectedOptions);
                }
              }}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="gender">Gender</label>
            <Select
              isMulti
              value={gender}
              options={[
                {
                  value: "*",
                  label: "All",
                },
                {
                  value: "Male",
                  label: "Male",
                },
                {
                  value: "Female",
                  label: "Female",
                },
                {
                  value: "Others",
                  label: "Others",
                },
              ]}
              onChange={(selectedOptions) => {
                if (selectedOptions.some((option) => option.value === "*")) {
                  handleGenderSelectAll();
                } else {
                  setGender(selectedOptions);
                }
              }}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="occupation">Occupation</label>
            <Select
              isMulti
              value={occupation}
              options={[
                {
                  value: "*",
                  label: "All",
                },
                ...occupations,
              ]}
              onChange={(selectedOptions) => {
                if (selectedOptions.some((option) => option.value === "*")) {
                  if (occupation.length === occupation.length - 1) {
                    setOccupation([]);
                  } else {
                    setOccupation(
                      occupations.filter((option) => option.value !== "*")
                    );
                  }
                } else {
                  setOccupation(selectedOptions);
                }
              }}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="occupation">State</label>
            <Select
              isMulti
              value={state}
              options={states}
              onChange={(selectedOptions) => {
                if (selectedOptions.some((option) => option.value === "*")) {
                  if (state.length === state.length - 1) {
                    setState([]);
                  } else {
                    setState(states.filter((option) => option.value !== "*"));
                  }
                } else {
                  setState(selectedOptions);
                }
              }}
            />
          </div>
        </div>

        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper check">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={() => {
                setIsFeatured(!isFeatured);
              }}
            />
            <label htmlFor="isFeatured">
              Add this to featured stories (pin to top)
            </label>
          </div>

          <div className="input-wrapper check">
            <input
              type="checkbox"
              id="isNSFW"
              checked={isNSFW}
              onChange={() => {
                setIsNSFW(!isNSFW);
              }}
            />
            <label htmlFor="isNSFW">This news contains NSFW content.</label>
          </div>
        </div>

        <div className="double-input-wrapper mb-3">
          <div className="input-wrapper check">
            <input
              type="checkbox"
              id="isPaid"
              checked={isPaid}
              onChange={() => {
                setIsPaid(!isPaid);
              }}
            />
            <label htmlFor="isPaid">This is a sponsored/paid news story</label>
          </div>

          <div className="input-wrapper">
            <input
              type={"text"}
              placeholder="Link to sponsor's website"
              className="form-control mt-2 p-2"
              value={sponsorURL}
              onChange={(e) => {
                setSponorURL(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="input-wrapper">
          <input
            type="file"
            name="image"
            onChange={(e) => {
              // return console.log(e.target.files[0].size / 1024 / 1024);
              setDisplayImage();
              const sizeInMB = e.target.files[0].size / 1024 / 1024;
              if (sizeInMB > 10) {
                setSizeError(true);
              } else {
                setSizeError(false);
                const img = URL.createObjectURL(e.target.files[0]);
                setDisplayImage(img);
                setImage(e.target.files[0]);
              }
            }}
          />
          {sizeError && (
            <p
              style={{
                color: "red",
                fontWeight: "500",
                marginTop: 5,
                fontSize: 13,
              }}
            >
              Please select image less than 10 MB in size.
            </p>
          )}
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
