import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Backend_url } from "../utils/constant";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // Local state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skills, setSkills] = useState("");

  // Sync local state with user on mount -> whenever the data updates it immediately sets local component states
  useEffect(() => {
    setFirstName(user?.data?.firstName || "");
    setLastName(user?.data?.lastName || "");
    setGender(user?.data?.gender || "");
    setImgUrl(user?.data?.imgUrl || "");
    setAge(user?.data?.age || "");
    setPhoneNumber(user?.data?.phoneNumber || "");
    setSkills(user?.data?.skills || "");
  }, [user]);

  // Validation for name fields  ---> for ui can ignore it 
  const namePattern = /^[A-Za-z][A-Za-z0-9-]*$/;
  const isValidName = (name) =>
    namePattern.test(name) && name.length >= 3 && name.length <= 30;

  const handleSave = async () => {
    try {
      const res = await axios.patch(
        `${Backend_url}/update`,
        {
          firstName,
          lastName,
          gender,
          imgUrl,
          phoneNumber,
          age,
          skills,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      alert(err?.response?.data || "Update failed");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto space-y-4">
        {/* First Name */}
        <label
          className={`input input-bordered flex items-center gap-2 ${
            isValidName(firstName) ? "border-green-500" : ""
          }`}
        >
          <span className="text-sm">👤</span>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            minLength={3}
            maxLength={30}
            pattern={namePattern.source}
            required
          />
        </label>

        {/* Last Name */}
        <label
          className={`input input-bordered flex items-center gap-2 ${
            isValidName(lastName) ? "border-green-500" : ""
          }`}
        >
          <span className="text-sm">👥</span>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            minLength={3}
            maxLength={30}
            pattern={namePattern.source}
            required
          />
        </label>

        {/* Phone Number */}
        <label className="input input-bordered flex items-center gap-2">
          <span className="text-sm">📞</span>
          <input
            type="tel"
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            minLength={10}
            maxLength={10}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>

        {/* Gender */}
        <label className="input input-bordered flex items-center gap-2">
          <span className="text-sm">⚧️</span>
          <input
            type="text"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </label>

        {/* Age */}
        <label className="input input-bordered flex items-center gap-2">
          <span className="text-sm">🎂</span>
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>

        {/* Image URL */}
        <label className="input input-bordered flex items-center gap-2">
          <span className="text-sm">🖼️</span>
          <input
            type="url"
            placeholder="Image URL"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
          />
        </label>
        
        {/* Skills */}
        <label className="input input-bordered flex items-center gap-2">
          <span className="text-sm">📚</span>
          <input
            type="text"
            placeholder="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </label>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          Save
        </button>
      </div>

      {/* User Card Preview */}
      <div className="mt-8 flex justify-center">
        <UserCard
          userFeed={{
            firstName,
            lastName,
            gender,
            phoneNumber,
            imgUrl,
            age,
            email: user?.data?.email || "N/A", // to fetch existing user's email and skills 
            skills: user?.data?.skills || [],
          }}
        />
      </div>
    </div>
  );
};

export default Profile;
