import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthContext } from "./context/AuthContext";
import { Chat, Home, Login, Register } from "./pages";
import { SetAvatar } from "./components/Register";

import ProfileUsers from "./components/Post/UsersProfile";
import Profile from "./pages/MyProfile";
import Search from "./components/Navbar/Search";
export default function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={!user ? <Navigate to="/login" replace /> : <Home />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/setAvatar"
                element={
                  !user ? <Navigate to="/login" replace /> : <SetAvatar />
                }
              />
              <Route
                path="/search"
                element={!user ? <Navigate to="/login" replace /> : <Search />}
              />
              <Route
                path="/chat"
                element={!user ? <Navigate to="/login" replace /> : <Chat />}
              />
              <Route
                path="/:id"
                element={
                  !user ? <Navigate to="/login" replace /> : <ProfileUsers />
                }
              />
              <Route
                path="/profile"
                element={
                  !user ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <Profile key={user?._id} />
                  )
                }
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </div>
    </>
  );
}
