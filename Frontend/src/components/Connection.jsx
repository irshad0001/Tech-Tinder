import axios from "axios";
import React, { useEffect } from "react";
import { Backend_url } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connection = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.connection); // must declare first
  const currentUserId = useSelector((store) => store.user?.data?._id);

  const handleConnection = async () => {
    const res = await axios.get(`${Backend_url}/view/my/connections`, {
      withCredentials: true,
    });
    dispatch(addConnection(res?.data));
    console.log(res?.data);
  };

  useEffect(() => {
    handleConnection();
  }, []);

  if (!user) return <p>Loading...</p>; // must return JSX
  if (user.length === 0) return <h1>No connection found</h1>;

  const filteredConnections = user.filter((c) => c._id !== currentUserId);

  if (filteredConnections.length === 0)
    return <h1>No connections found (excluding yourself)</h1>;

  return (
    <div className="text-center my-2">
      <h1 className="text-2xl">Connection</h1>
      {filteredConnections.map((connection) => {
        const { _id, firstName, lastName, gender, age, skills, imgUrl } =
          connection;
        return (
          <div
            key={_id}
            className="flex items-center gap-4 my-4 mx-auto p-4 rounded-2xl shadow-lg border border-gray-200 bg-white w-full max-w-md"
          >
            <div>
              <img
                className="w-20 h-20 rounded-2xl object-cover"
                src={imgUrl || "https://via.placeholder.com/80"}
                alt={`${firstName} ${lastName}`}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                {firstName + " " + lastName}
              </h2>
              <p className="text-sm text-gray-600">
                {age || "18+"} &nbsp; | &nbsp; {gender}
              </p>
              <p className="text-sm text-gray-700">{skills.join(" , ")}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connection;
