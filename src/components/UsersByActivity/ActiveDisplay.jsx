import React, { useEffect, useState } from "react";
import Axios from "./../../api/server";

function ActiveDisplay(props) {
  const [activeDays, setActiveDays] = useState();

  const getUserActivityOverTime = async (id) => {
    try {
      const response = await Axios.get(
        `/users/profile/getUserActivity?userId=${id}`
      );
      // console.log("hi", response.data.data);
      setActiveDays(response.data.data.length);
    } catch (error) {}
  };

  useEffect(() => {
    getUserActivityOverTime(props.id);
  }, [props.id]);

  useEffect(() => {
    if (activeDays) {
      props.data.map((item) => {
        if (item.id === props.id) {
          item.activeDays = activeDays;
        }
      });
    }
  }, [activeDays]);

  return Number(activeDays);
}

export default ActiveDisplay;
