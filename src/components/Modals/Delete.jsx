import React, { useState, useEffect } from "react";
import Axios from "./../../api/server";

const Delete = ({
  title,
  route,
  setIsDeleteOpen,
  fetchData,
  toast,
  toastMessage,
}) => {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    setConfig({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }, []);

  const handleDelete = async () => {
    try {
      await Axios.delete(route, config);
      window.location.reload();
      setIsDeleteOpen(false);
      fetchData();
      toast.success(toastMessage, {
        theme: "colored",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="show" id="exampleModal">
        <div
          className="modal fade show"
          id="exampleModal"
          role="dialog"
          style={{
            display: "block",
          }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete ?</h5>
              </div>
              <div className="modal-body">
                <h5>{title}</h5>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    // setIsDeleteOpen(false);
                    handleDelete();
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsDeleteOpen(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" id="backdrop"></div>
    </>
  );
};

export default Delete;
