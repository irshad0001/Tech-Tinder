import axios from "axios";
import React, { useState, useEffect } from "react";
import { Backend_url } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState("");

  const [isLogin, setIsLogin] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user?.data) navigate("/feed");
  }, [user, navigate]);

  // now no need to repeat same code (axios.post) with minor changes in signUp and login logic
  /**  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        `${Backend_url}/signUp`,
        {
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
          skills, // must be an array
          gender,
          imgUrl: "",
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data));
      console.log(res?.data);
      navigate("/profile");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      alert("Signup failed: " + (err.response?.data || err.message));
    }
  };
  *  */

  const handleAuth = async () => {
    try {
      const payload = isLogin
        ? { email, password }
        : {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            skills, // must be an array
            gender,
            imgUrl: "",
          };

      const endpoint = isLogin ? "/login" : "/signUp";

      const res = await axios.post(`${Backend_url}${endpoint}`, payload, {
        withCredentials: true,
      });

dispatch(addUser(res?.data));

const newUser = res?.data?.user; // your backend returns { message, user }

if (!newUser?.imgUrl || newUser?.imgUrl === "") {
  navigate("/profile");
} else {
  navigate("/feed");
}

    } catch (err) {
      console.error("Auth failed:", err);
      alert("Login/SignUp failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center my-5">
      <div className="card bg-red-400 text-black w-96">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center">
            {isLogin ? "Login" : "SignUp"}
          </h2>

          {!isLogin && (
            <>
              {/* First Name */}
              <label className="input validator bg-white mt-4">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 12c2.7 0 4.5-1.8 4.5-4.5S14.7 3 12 3 7.5 4.8 7.5 7.5 9.3 12 12 12Z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </label>

              {/* Last Name */}
              <label className="input validator bg-white mt-4">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 12c2.7 0 4.5-1.8 4.5-4.5S14.7 3 12 3 7.5 4.8 7.5 7.5 9.3 12 12 12Z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </label>
              {/* Phone Number */}
              <label className="input validator bg-white mt-4">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M6.62 10.79a15.09 15.09 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21 11.72 11.72 0 0 0 3.64.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.72 11.72 0 0 0 .58 3.64 1 1 0 0 1-.21 1.11l-2.2 2.2Z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </label>
              {/* Gender */}
              <label className="input validator bg-white mt-4">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 2a5 5 0 0 0-1 9.9V14H9v2h2v6h2v-6h2v-2h-2v-2.1A5 5 0 0 0 12 2Zm0 2a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z"
                  />
                </svg>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
              </label>
              {/* Skills */}
              <label className="input validator bg-white mt-4">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M9 2C7.34 2 6 3.34 6 5v1H5a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1V5c0-1.66-1.34-3-3-3H9zm0 2h6c.55 0 1 .45 1 1v1H8V5c0-.55.45-1 1-1zm-4 5h14v10H5V9zm4 2v2h6v-2H9z"
                  />
                </svg>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Enter skills (comma separated)"
                  className="bg-white outline-none w-full"
                  required
                />
              </label>
            </>
          )}

          {/* Email */}
          <label className="input validator bg-white mt-4">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </g>
            </svg>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Password */}
          <label className="input validator bg-white mt-4">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </g>
            </svg>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be at least 8 characters with a number, a lowercase and an uppercase letter"
            />
          </label>

          {/* Submit Button */}
          <div className="card-actions flex  mt-4">
            <button
              onClick={handleAuth} // if signUp and login logic in differnt line then onClick={isLogin?hadleSignIn:handleSignUp}
              className="btn btn-neutral"
            >
              {isLogin ? "Login" : "SignUp"}
            </button>

            <p
              onClick={() => setIsLogin((prev) => !prev)} // login -> signup change logic here...
              className="cursor-pointer "
            >
              {isLogin ? "Create Account" : "Already have an account?"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
