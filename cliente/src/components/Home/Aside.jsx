import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NavLink, Link } from "react-router-dom";
import icon from "../../assets/icon.png";
import { Toggle } from "../Navbar";
import ColorItem from "./colorItem";
import axios from "axios";
import { ReactSVG } from "react-svg";
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
  const { dispatch, userData } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const modalnotifications = useRef(null);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const secondModalRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [followersUsers, setFollowersUsers] = useState([]);

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

  const openModal2 = () => {
    setIsOpen2(true);
  };

  const closeModal2 = () => {
    setIsOpen2(false);
  };

  const navLinks = [
    {
      to: "/",
      icon: <HomeIcon />,
      text: "home",
      activeClassName: "active",
      onClick: closeModal2,
    },
    {
      to: "/search",
      icon: <SearchIcon />,
      text: "search",
      activeClassName: "active",
      onClick: closeModal2,
    },
    {
      icon: <BellIcon />,
      text: "Notifications",
      onClick: openModal2,
      // Agregar el onClick para abrir el modal
    },
    {
      to: "/chat",
      icon: <ChatIcon />,
      text: "chat",
      activeClassName: "active",
      onClick: closeModal2,
    },
    {
      to: "/Profile",
      icon: <UserIcon />,
      text: "Profile",
      activeClassName: "active",
      onClick: closeModal2,
    },
  ];
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

  const renderNavLinks = () => {
    return navLinks.map((link, index) => (
      <li
        key={index}
        className="cursor-pointer text-xl max-2xl:text-sm flex items-center"
      >
        {link.to ? (
          <NavLink
            onClick={link.onClick}
            to={link.to}
            activeClassName={link.activeClassName}
            className="flex gap-4 p-8 max-lg:p-2 hover:bg-gray-100 dark:hover:bg-white/10 max-2xl:pl-16 px-12 max-2xl:px-6 w-full color capitalize"
          >
            {link.icon}
            <span>{link.text}</span>
          </NavLink>
        ) : (
          <button
            onClick={link.onClick}
            className="flex gap-4 p-8 max-lg:p-2 hover:bg-gray-100 dark:hover:bg-white/10 max-2xl:pl-16 px-12 max-2xl:px-6 w-full color capitalize"
          >
            {link.icon}
            <span>{link.text}</span>
          </button>
        )}
      </li>
    ));
  };

  useEffect(() => {
    const fetchFollowersUsers = async () => {
      try {
        if (Array.isArray(userData?.following)) {
          const userPromises = userData.followers.map((userId) =>
            axios.get(`http://localhost:5050/users/${userId}`)
          );

          const users = await Promise.all(userPromises);
          const followingUsersData = users.map((response) => response.data);
          setFollowersUsers(followingUsersData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowersUsers();
  }, [userData?.following]);

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
          <ul className="flex flex-col uppercase">
            {renderNavLinks()}

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
          <div className="fixed inset-0 flex items-center left-2 top-[28rem]">
            <div
              ref={modalRef}
              className={`dark:bg-[#0a0a13] dark:border bg-white px-6 py-6 rounded-xl shadow-xl modal-content z-20 w-[18rem] h-fit transition-opacity  duration-300 ease-out`}
            >
              <div className="flex flex-col">
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
                  to="/"
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
          <div className="fixed inset-0 flex items-center left-2 top-[30rem] z-40 ">
            <div
              ref={secondModalRef}
              className="dark:bg-[#0a0a13] dark:border bg-white rounded-xl shadow-xl modal-content z-20 w-[17.5rem] h-fit"
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

      {isOpen2 && (
        <div className="fixed max-xl:hidden inset-0 flex items-center z-20">
          <div
            ref={modalnotifications}
            className={`bg-white dark:bg-[#0a0a13] absolute shadow-sm modal-content z-20  w-[300px] max-xl:hidden h-full transition-opacity  duration-300 ease-out`}
          >
            <div className="w-full relative py-12 mb-12 flex justify-center items-center border-b-2">
              <p className="text-center text-2xl dark:text-white">
                Notifications
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer absolute left-7 dark:stroke-white"
                onClick={closeModal2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            {followersUsers.map((element, key) => (
              <div
                className="flex justify-between  py-10 px-4 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10"
                key={element._id}
              >
                <div className="flex w-full items-center ">
                  <a
                    className="flex items-center justify-evenly w-full "
                    href={"/" + element._id}
                  >
                    <div className="w-full flex items-center gap-4 ">
                      <ReactSVG
                        src={`data:image/svg+xml;base64,${btoa(
                          element.avatarImage
                        )}`}
                        className="color-item rounded-full w-16 h-full"
                      />
                      <h3 className="dark:text-white text-lg">
                        <span className="text font-bold">
                          {element.username}
                        </span>{" "}
                        has started to follow you.
                      </h3>
                    </div>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div
            className="fixed inset-0 max-xl:hidden"
            onClick={closeModal2}
          ></div>
        </div>
      )}
    </>
  );
};
const setTheme = (color) => {
  document.documentElement.style.setProperty("--bg-color", color);
};

export default Aside;
