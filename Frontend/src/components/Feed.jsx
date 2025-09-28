import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";
import { addFeed } from "../utils/feedSlice";
import axios from "axios";
import { Backend_url } from "../utils/constant";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userFeed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // track current card

  const fetchFeedUser = async () => {
    try {
      const res = await axios.get(`${Backend_url}/connection/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data || []));
    } catch (err) {
      console.error("Error fetching feed:", err.message);
      navigate("/login"); // Redirect to login if fetch fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedUser();
  }, []);

  // Move to next card automatically when the first one is removed
  useEffect(() => {
    if (currentIndex >= userFeed.length) {
      setCurrentIndex(0); // reset or show empty message
    }
  }, [userFeed, currentIndex]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!userFeed || userFeed.length === 0)
    return <p className="text-center mt-10">No users left in the feed</p>;

  return (
    <div className="text-center p-10">
      <h1 className="text-2xl font-bold">Welcome to the Feed</h1>
      <div className="flex justify-center my-3">
        <UserCard
          userFeed={userFeed[currentIndex]}
          onNext={() => setCurrentIndex((prev) => prev + 1)} // increment index after action
        />
      </div>
    </div>
  );
};

export default Feed;
