import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/Navbar/ThemeContext";
import { AuthContext } from "./context/AuthContext";
import { Chat, Login, MainHome, Register } from "./pages";
import { SetAvatar } from "./components/Register";
import { Search } from "./components/Navbar/Search";
import ProfileUsers from "./components/Post/UsersProfile";
import Profile from "./pages/MyProfile";
import Notifications from "./components/Navbar/Notifications";
export default function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainHome />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/setAvatar" element={<SetAvatar />} />
              <Route path="/search" element={<Search />} />
              <Route path="/chat" element={[<Chat />]} />
              <Route path="/notifications" element={[<Notifications />]} />
              <Route path="/Profile/:id" element={[<ProfileUsers />]} />
              <Route path="/profile" element={<Profile key={user?._id} />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </div>
    </>
  );
}
