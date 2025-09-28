import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./Body"
import Login from "./components/Login"

import Feed from "./components/Feed"
import Profile from "./components/Profile"
import Connection from "./components/Connection"
import Request from "./components/Request"

function App() {
  return (
    <>
     <BrowserRouter basename="/">{/** for routing ... basename ='/' url start with / */}
     <Routes>
      <Route path="/" element={<Body/>}>    {/**login & Logout = children of Body so to display them along with Body in Body need to pass <Outlet/> */}
      <Route path="/feed" element={<Feed/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/profile" element={<Profile/>}></Route>
      <Route path="/connection" element={<Connection/>}></Route>
      <Route path="/request" element={<Request/>}></Route>
      
      </Route>
     </Routes>
     </BrowserRouter>
    </>
  )
}
export default App
