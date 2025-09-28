import axios from "axios";
import { useEffect, useState } from "react";
import { Backend_url } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { useNavigate } from "react-router-dom";

const Request = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request || []); // Safe fallback
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null); // For showing button loader/disable

  // Handle Accept/Reject Review Request
  const reviewRequest = async (status, _id) => {
    try {
      setLoadingId(_id);
      const res = await axios.post(
        `${Backend_url}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id)); // Remove from state immediately
      setLoadingId(null);
    } catch (err) {
      console.error("Error reviewing request:", err);
      setLoadingId(null);
    }
  };

  // Fetch connection requests
  const handleRequest = async () => {
    try {
      const res = await axios.get(`${Backend_url}/view/request/connection`, {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data));
      console.log(res?.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    handleRequest();
  }, []);

  if (!requests?.length) return <p className="text-center mt-4">No Request</p>;

  return (
    <div className="text-center my-2">
      <h1 className="text-2xl font-bold mb-4">Requests</h1>
      {requests.map((request) => {
        const { _id, firstName, lastName, gender, age, skills, imgUrl } =
          request?.fromUserId || {};

        return (
          <div
            key={request._id}
            className="flex items-center gap-4 my-4 mx-auto p-4 rounded-2xl shadow-lg border border-gray-200 bg-white w-full max-w-md"
          >
            <div>
              <img
                className="w-20 h-20 rounded-2xl object-cover"
                src={imgUrl}
                alt={`${firstName} ${lastName}`}
              />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-lg font-semibold text-gray-700">
                {firstName} {lastName}
              </h2>
              <p className="text-sm text-gray-600">
                {age || "18+"} &nbsp; | &nbsp; {gender}
              </p>
              <p className="text-sm text-gray-700">
                {skills?.join(" , ") || "No skills listed"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => reviewRequest("accepted", request._id)}
                disabled={loadingId === request._id}
                className="btn btn-outline btn-success"
              >
                {loadingId === request._id ? "Accepting..." : "Accept"}
              </button>
              <button
                onClick={() => reviewRequest("rejected", request._id)}
                disabled={loadingId === request._id}
                className="btn btn-outline btn-error"
              >
                {loadingId === request._id ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Request;
