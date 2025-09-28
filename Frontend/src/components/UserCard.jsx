import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";
import axios from "axios";
import { Backend_url } from "../utils/constant";

const UserCard = ({ userFeed }) => {
  const [loadingId, setLoadingId] = useState(null);
  const dispatch = useDispatch();

  const handleSendRequest = async (status, toUserId) => {
    try {
      setLoadingId(toUserId);
      await axios.post(
        `${Backend_url}/send/request/${status}/${toUserId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeed(toUserId));
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoadingId(null);
    }
  };

  if (!userFeed) {
    return <p className="text-center text-gray-400">User not found</p>;
  }

  const {
    firstName,
    lastName,
    email = "N/A",
    gender,
    skills = [],
    phoneNumber,
    imgUrl,
    age,
    _id,
  } = userFeed;

  return (
    <div className="card bg-base-300 w-80 shadow-sm">
      <figure>
        <img
          className="w-80 h-80 p-2 object-cover"
          src={imgUrl || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={firstName}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        <p><span className="font-bold">Gender:</span> {gender}</p>
        <p><span className="font-bold">Age:</span> {age || "18+"}</p>
        <p><span className="font-bold">Email:</span> {email}</p>
        <p><span className="font-bold">Skills:</span> {skills.join(" , ")}</p>
        <p><span className="font-bold">Call:</span> {phoneNumber}</p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleSendRequest("interested", _id)}
            disabled={loadingId === _id}
            className="btn btn-outline btn-success"
          >
            {loadingId === _id ? "Interested..." : "Interested"}
          </button>
          <button
            onClick={() => handleSendRequest("ignored", _id)}
            disabled={loadingId === _id}
            className="btn btn-outline btn-error"
          >
            {loadingId === _id ? "Ignoring..." : "Ignore"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
