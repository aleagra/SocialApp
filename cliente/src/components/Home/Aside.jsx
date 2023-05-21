import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import icon from "../../assets/icon.png";

import { Toggle } from "../Navbar";
import ColorItem from "./colorItem";
import {
  BarsIcon,
  BellIcon,
  ChatIcon,
  HomeIcon,
  PenIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from "../../utilities";

const Aside = () => {
  let btn = document.getElementById("btn");
  let modal = document.getElementById("modal");
  let nav = document.getElementById("nav");
  let plus = document.getElementById("plus");
  const { dispatch } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const secondModalRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const handleOutsideClickSecondModal = (event) => {
    if (
      secondModalRef.current &&
      !secondModalRef.current.contains(event.target) &&
      !event.target.classList.contains("modal-content")
    ) {
      setSecondModalOpen(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.classList.contains("modal-content")
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("mousedown", handleOutsideClickSecondModal);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("mousedown", handleOutsideClickSecondModal);
    };
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const navLinks = [
    {
      to: "/",
      icon: <HomeIcon />,
      text: "home",
    },
    {
      to: "/search",
      icon: <SearchIcon />,
      text: "search",
    },
    {
      icon: <BellIcon />,
      text: "Notifications",
    },

    {
      to: "/chat",
      icon: <ChatIcon />,
      text: "chat",
    },
    {
      to: "/Profile",
      icon: <UserIcon />,
      text: "perfil",
    },
  ];
  const colors = ["#ff6961", "#2ABA7D", "#84b6f4", "#dafc56"];
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };
  const defaultColor = "#2ABA7D";
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

  const renderNavLinks = () => {
    return navLinks.map((link, index) => (
      <li
        key={index}
        className="cursor-pointer text-xl max-2xl:text-sm font-bold flex items-center"
      >
        <Link
          to={link.to}
          className="flex gap-4 p-8 max-lg:p-2 hover:bg-black/10 dark:hover:bg-white/20  px-12 max-2xl:px-6 w-full color font-bold"
        >
          {link.icon}
          <span>{link.text}</span>
        </Link>
      </li>
    ));
  };

  return (
    <>
      <div className="fixed top-0 z-10 left-0 w-[15%] h-full max-lg:hidden shadow-md dark:text-white bg-white dark:bg-[#0a0a13]">
        <div className="flex h-fit px-12 max-2xl:px-4 max-lg:px-0 py-12 w-full items-center">
          <Link to="/" className="flex gap-2">
            <img src={icon} className="w-10 h-100" alt="" />
            <p className="text-2xl uppercase dark:text-white">SocialApp</p>
          </Link>
        </div>
        <div className="w-full h-fit ">
          <ul className="flex flex-col uppercase">
            {renderNavLinks()}

            <li
              className="p-8 px-12 h-fit w-full mb-16 text-xl absolute bottom-0 flex gap-4 font-bold cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 color"
              onClick={openModal}
            >
              <BarsIcon />
              <span className="">mas</span>
            </li>
          </ul>
        </div>
        {isOpen && (
          <div className="fixed inset-0 flex items-center left-20 top-[28rem]">
            <div
              ref={modalRef}
              className={`dark:bg-[#1e1f23] bg-white px-6 py-6 rounded-xl shadow-xl modal-content z-20 w-[18rem] h-fit transition-opacity  duration-300 ease-out`}
            >
              <div className="flex flex-col">
                <Link className="flex items-center gap-4 p-4 hover:bg-black/10 dark:hover:bg-white/40">
                  <UsersIcon />
                  <span
                    className="text-xl font-bold"
                    onClick={() => setSearchActive(true)}
                  >
                    About me
                  </span>
                </Link>
                <Link
                  className="flex items-center gap-4 p-4 hover:bg-black/10 dark:hover:bg-white/40"
                  onClick={() => {
                    setSecondModalOpen(true);
                    setIsOpen(false);
                  }}
                >
                  <PenIcon />
                  <p className="text-xl font-bold">View</p>
                </Link>
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 hover:bg-black/10 dark:hover:bg-white/40"
                >
                  <UserIcon />
                  <span className="text-xl font-bold">Log out</span>
                </Link>
              </div>
            </div>
            <div className="fixed inset-0 " onClick={closeModal}></div>
          </div>
        )}
        {isSecondModalOpen && (
          <div className="fixed inset-0 flex items-center left-28 top-[30rem] ">
            <div
              ref={secondModalRef}
              className="dark:bg-[#1e1f23] bg-white rounded-xl shadow-xl modal-content z-20 w-[19rem] h-fit"
            >
              <div className="modal-body relative p-4">
                <div className="flex flex-wrap gap-6 p-3 max-sm:py-0">
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
          </div>
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
