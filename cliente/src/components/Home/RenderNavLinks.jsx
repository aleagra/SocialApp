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
import "../../assets/css/index.css";
import { ReactSVG } from "react-svg";

export const RenderNavLink = () => {
  const { userData } = useContext(AuthContext);
  const [isOpen2, setIsOpen2] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);

  const openModal = () => {
    setIsOpen2(!isOpen2);
  };

  const closeModal = () => {
    setIsOpen2(!isOpen2);
  }


  const navLinks = [
    {
      to: "/",
      icon: <HomeIcon />,
      text: "home",
      activeClassName: "active",
      onClick: closeModal,
    },
    {
      to: "/search",
      icon: <SearchIcon />,
      text: "search",
      activeClassName: "active",
      onClick: closeModal,
    },
    {
      icon: <BellIcon />,
      text: "Notifications",
      onClick: openModal,
    },
    {
      to: "/chat",
      icon: <ChatIcon />,
      text: "chat",
      activeClassName: "active",
      onClick: closeModal,
    },
    {
      to: "/Profile",
      icon: <UserIcon />,
      text: "Profile",
      activeClassName: "active",
      onClick: closeModal,
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
          closeModal={closeModal}
          title={"Notifications"}
          style={`fixed w-[300px] h-screen dark:bg-[#0a0a13]`}
          content={
            <>
              <div
                transition-style="in:wipe:right"
                className={`bg-white dark:bg-[#0a0a13] shadow-sm  z-20 max-xl:hidden w-full h-screen transition-opacity duration-300 ease-out`}
              >
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
