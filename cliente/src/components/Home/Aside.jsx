import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Toggle } from "../Navbar";
import ColorItem from "./colorItem";
import { ReactSVG } from "react-svg";
import icon from "../../assets/icon.png";
import FetchFollowersUsers from "../User/FetchFollowingUsers";
import FetchFollowingUsers from "../User/FetchFollowingUsers";
import { BarsIcon, PenIcon, UserIcon } from "../../utilities";
import Modal from "./Modal";
import { RenderNavLink } from "./RenderNavLinks";

const Aside = () => {
  const { dispatch, userData } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const secondModalRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal2 = () => {
    setIsOpen2(true);
  };

  const closeModal3 = () => {
    setIsOpen3(false);
  };

  const colors = ["#E10606", "#0F9130", "#3579FA", "#913CA0"];
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    location.reload();
  };
  const defaultColor = "#E10606";
  let currentColor = defaultColor;
  const setColor = (event) => {
    currentColor = event.target.style.getPropertyValue("--bg-color");
    if (currentColor === "undefined") {
      currentColor = defaultColor;
    }
    setTheme(currentColor);
    localStorage.setItem("color", currentColor);
  };
  useEffect(() => {
    const currentColor = localStorage.getItem("color");
    setTheme(currentColor);
  });

  return (
    <>
      <div className="flex-col max-xl:hidden z-10 flex h-screen shadow-md dark:text-white bg-white dark:bg-[#0a0a13] ">
        <div className="flex px-12 max-2xl:px-4 max-lg:px-0 max-2xl:py-8 py-12 w-full max-2xl:justify-center">
          <Link to="/" className="flex gap-2 items-center">
            <img src={icon} className="w-10 h-100" alt="" />
            <p className="text-2xl uppercase dark:text-white">SocialApp</p>
          </Link>
        </div>
        <div className="w-full h-full relative">
          <ul className="flex flex-col">
            <RenderNavLink />
            <li
              className="p-8 px-12 h-fit w-full mb-16 max-2xl:mb-[15px] max-2xl:px-6 max-2xl:text-sm  max-2xl:pl-16 text-xl absolute bottom-0 flex gap-4 capitalize cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 color -tracking-tighter"
              onClick={openModal}
            >
              <BarsIcon />
              <span>More</span>
            </li>
          </ul>
        </div>
        {isOpen && (
          <Modal
            isOpen={isOpen}
            title={"Settings"}
            closeModal={closeModal}
            style={`dark:bg-[#0a0a13] dark:border fixed left-2 top-[36rem] bg-white px-6 py-2 rounded-xl shadow-xl z-20 w-[18rem] transition-opacity  duration-300 ease-out`}
            content={
              <div className="flex flex-col">
                <Link
                  className="flex items-center gap-4 p-4 hover:bg-black/10 dark:hover:bg-white/40"
                  onClick={() => {
                    setIsOpen3(true);
                    setIsOpen(false);
                  }}
                >
                  <PenIcon />
                  <p className="text-xl font-bold">View</p>
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 hover:bg-black/10 dark:hover:bg-white/40"
                >
                  <UserIcon />
                  <span className="text-xl font-bold">Log out</span>
                </Link>
              </div>
            }
          />
        )}
        {isOpen3 && (
          <Modal
            isOpen={isOpen3}
            title={"View"}
            closeModal={closeModal3}
            style={`fixed flex dark:border px-6 py-2 w-[18rem] rounded-xl items-center flex-col left-2 top-[36rem] z-40`}
            content={
              <div
                ref={secondModalRef}
                className="dark:bg-[#0a0a13] bg-white rounded-xl shadow-xl modal-content z-20 w-[17.5rem] h-fit"
              >
                <div className="modal-body relative p-4">
                  <div className="flex flex-wrap gap-4 p-3 max-sm:py-0">
                    <h1>Colors:</h1>
                    {colors.map((color, idx) => (
                      <ColorItem key={idx} setColor={setColor} color={color} />
                    ))}
                  </div>
                  <div className="flex gap-2 p-3 items-center">
                    <h1>Thema:</h1>
                    <Toggle />
                  </div>
                </div>
              </div>
            }
          />
        )}
      </div>
      {searchActive && (
        <div className="flex absolute bg-black h-screen w-[15%] z-20 justify-center left-0">
          <div className="flex-1">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
};
const setTheme = (color) => {
  document.documentElement.style.setProperty("--bg-color", color);
};

export default Aside;
