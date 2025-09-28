import NavBar from "./components/NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import axios from "axios";
import { Backend_url } from "./utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addUser, removeUser } from "./utils/userSlice";
import ShimmerUi from "./components/SimmerUi"

const Body = () => {

  const dispatch = useDispatch();
  const navigate =useNavigate()
  const user = useSelector((state) => state.user);
  console.log(user)

useEffect(() => {
  fetchUser();
}, []);

const fetchUser = async () => {
  if(!user)
    <ShimmerUi/>
  try {
    const res = await axios.get(`${Backend_url}/profile`, {
      withCredentials: true,
    });
    dispatch(addUser(res.data));
  } catch (err) {
    dispatch(removeUser());
    navigate("/login");
  }
};


  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
       <main className="flex-grow px-4 py-6 flex justify-center">
      <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
