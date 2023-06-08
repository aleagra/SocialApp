import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import React from "react";
import {
  BellIcon,
  ChatIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
} from "../../utilities";
import { NavLink } from "react-router-dom";
import Modal from "./Modal";
import FetchFollowingUsers from "../User/FetchFollowingUsers";

export const RenderNavLink = () => {
  const { userData } = useContext(AuthContext);
  const [isOpen2, setIsOpen2] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);

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
  FetchFollowingUsers(userData, setFollowingUsers);
  return (
    <>
      {navLinks.map((link, index) => (
        <li
          key={index}
          className="cursor-pointer text-xl max-2xl:text-sm flex items-center"
        >
          {link.to ? (
            <>
              <NavLink
                onClick={link.onClick}
                to={link.to}
                activeClassName={link.activeClassName}
                className="flex gap-4 p-8 max-lg:p-2 hover:bg-gray-100 dark:hover:bg-white/10 max-2xl:pl-16 px-12 max-2xl:px-6 w-full color capitalize"
              >
                {link.icon}
                <span>{link.text}</span>
              </NavLink>
            </>
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
      ))}
      {isOpen2 && (
        <Modal
          isOpen={isOpen2}
          closeModal={closeModal2}
          style={`fixed max-xl:hidden inset-0 flex items-center z-20 bg-white dark:bg-[#0a0a13] absolute shadow-sm  w-[300px] max-xl:hidden h-full transition-opacity  duration-300 ease-out `}
          content={
            <>
              <div
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
                {followingUsers.map((element, key) => (
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
            </>
          }
        />
      )}
    </>
  );
};
