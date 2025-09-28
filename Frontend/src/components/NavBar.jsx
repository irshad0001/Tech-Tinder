import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Backend_url } from "../utils/constant";
import {removeUser} from "../utils/userSlice"


const NavBar = () => {
  const userData = useSelector((store) => store.user); // accessing user directly
  const navigate = useNavigate();
  const dispatch=useDispatch()
  console.log(userData)
  const handleLogout =async ()=>{
 await axios.post(`${Backend_url}/logout`,{},{withCredentials:true} /**config*/)
 dispatch(removeUser())
 navigate(`/login`)
  }
  /**  axios.post,.put,.patch(url, data, config)  -> accept 3 arguments , don't want to give data omit it {}-> Login.jsx (better understanding).
   * 
   * axios.get && .delete(url, config) -> accept 2 arguments

   * await axios.post(`${Backend_url}/logout`, {}, { withCredentials: true }) ✅  // works
   * await axios.post(`${Backend_url}/logout`, { withCredentials: true }) ❌  // does NOT work

   */

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to={'/feed'} className="btn btn-ghost text-xl">DevTinder</Link>
      </div>

      {userData?.data && (         // it's like ternary operator
        <div className="flex gap-3 mx-4">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
          <p>{userData?.data?.firstName}</p>
          <div className="dropdown dropdown-end flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User profile"
                  src={userData?.data?.imgUrl}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={'/profile'}
                 className="justify-between">
                  Profile
                </Link> 
                  {/** instead Link to (remove a tag)
                   * onClick={()=>navigate('/profile')} within a tag 
                   * Link to is more symantic
                   */}
                
              </li>
              <li>
                <Link to={'/connection'}>Connection</Link>
              </li>
              <li>
                <Link to={'/request'}>Request</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
