import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { Toggle } from "../Navbar";
import ColorItem from "../Home/colorItem";
import axios from "axios";
import { ReactSVG } from "react-svg";
import {
  BellIcon,
  ChatIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
} from "../../utilities";

const NavResponsive = () => {
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
    },
    {
      to: "/search",
      icon: <SearchIcon />,
      text: "search",
      activeClassName: "active",
    },
    {
      icon: <BellIcon />,
      text: "Notifications",
      onClick: openModal2,
    },
    {
      to: "/chat",
      icon: <ChatIcon />,
      text: "chat",
      activeClassName: "active",
    },
    {
      to: "/profile",
      icon: <UserIcon />,
      text: "Profile",
      activeClassName: "active",
    },
  ];
  const colors = ["#ff6961", "#2ABA7D", "#84b6f4", "#dafc56"];
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    location.reload();
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
        className="cursor-pointer text-xl max-2xl:text-sm flex items-center"
      >
        {link.to ? (
          <NavLink
            onClick={link.onClick}
            to={link.to}
            activeclassname={link.activeclassname}
            className="flex p-5 hover:bg-black/10 dark:hover:bg-white/10  w-full color font-bold"
          >
            {link.icon}
          </NavLink>
        ) : (
          <button
            onClick={link.onClick}
            className="flex p-5 hover:bg-black/10 dark:hover:bg-white/20  w-full color font-bold"
          >
            {link.icon}
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
            axios.get(
              `https://socialapp-backend-production-a743.up.railway.app/users/${userId}`
            )
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
      <div className="items-end xl:hidden flex fixed bottom-0 z-50 w-full shadow-md dark:text-white bg-white dark:bg-[#0a0a13]">
        <ul className="flex w-full z-50 justify-center items-center uppercase">
          {renderNavLinks()}
        </ul>

        {isOpen && (
          <div className="fixed inset-0 flex items-center left-20 top-[28rem]">
            <div
              ref={modalRef}
              className={`dark:bg-[#0a0a13] dark:border bg-white px-6 py-6 rounded-xl shadow-xl modal-content z-20 w-[18rem] h-fit transition-opacity  duration-300 ease-out`}
            >
              <div className="flex flex-col"></div>
            </div>
            <div className="fixed inset-0 " onClick={closeModal}></div>
          </div>
        )}
        {isSecondModalOpen && (
          <div className="fixed inset-0 flex items-center left-28 top-[30rem] ">
            <div
              ref={secondModalRef}
              className="dark:bg-[#0a0a13] dark:border bg-white rounded-xl shadow-xl modal-content w-[19rem] h-fit"
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

      {isOpen2 && (
        <div className="fixed xl:hidden flex justify-center w-full h-full z-0 top-0 items-center">
          <div
            ref={modalnotifications}
            className={`bg-white dark:bg-[#0a0a13] absolute p-2 shadow-sm modal-content w-full h-full top-0 transition-opacity duration-300 ease-out`}
          >
            <div className="w-full relative py-12 mb-12 flex justify-center items-center border-b-2">
              <p className="text-center text-2xl dark:text-white">
                Notifications
              </p>
            </div>

            {followersUsers.length < 1 ? (
              <div className="h-[20rem] w-full max-md:text-center flex flex-col items-center gap-y-[1rem] justify-center px-[2rem]">
                <BellIcon />
                <h1 className="text-xl capitalize font-semibold dark:text-white text-center">
                  There are no notifications to show.
                </h1>
                <p className="text-lg dark:text-white text-center opacity-40">
                  Here the people who start to follow you will be shown.
                </p>
              </div>
            ) : (
              followersUsers.map((element, key) => (
                <div
                  className="flex justify-center w-full xl:hidden  dark:hover:bg-white/20 hover:bg-black/10 my-6"
                  key={element._id}
                >
                  <div className="flex w-full items-center">
                    <a
                      className="flex items-center justify-evenly w-full"
                      href={"/" + element._id}
                    >
                      <div className="w-full flex items-center gap-4 px-12">
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
              ))
            )}
          </div>
          <div className="fixed xl:hidden" onClick={closeModal2}></div>
        </div>
      )}
    </>
  );
};
const setTheme = (color) => {
  document.documentElement.style.setProperty("--bg-color", color);
};

export default NavResponsive;
