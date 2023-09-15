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
import "../../assets/css/index.css";
import { ReactSVG } from "react-svg";
import { FetchFollowersUsers } from "../User";

export const RenderNavLink = () => {
  const { userData } = useContext(AuthContext);
  const [isOpen2, setIsOpen2] = useState(false);
  const [followersUsers, setFollowersUsers] = useState([]);

  const openModal = () => {
    setIsOpen2(!isOpen2);
  };

  const closeModal = () => {
    setIsOpen2(false);
  };

  const navLinks = [
    {
      to: "/",
      icon: <HomeIcon />,
      text: "home",
      activeclassname: "active",
      onClick: closeModal,
    },
    {
      to: "/search",
      icon: <SearchIcon />,
      text: "search",
      activeclassname: "active",
      onClick: closeModal,
    },
    {
      icon: <BellIcon className={"w-6 h-6 hover"} />,
      text: "Notifications",
      onClick: openModal,
    },
    {
      to: "/chat",
      icon: <ChatIcon />,
      text: "chat",
      activeclassname: "active",
      onClick: closeModal,
    },
    {
      to: "/profile",
      icon: <UserIcon />,
      text: "Profile",
      activeclassname: "active",
      onClick: closeModal,
    },
  ];
  FetchFollowersUsers(userData, setFollowersUsers);

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
                activeclassname={link.activeclassname}
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
          style={`fixed w-[300px] h-screen dark:bg-[#0a0a13] bg-white dark:bg-[#0a0a13]`}
          content={
            <>
              <div
                className={` shadow-sm  z-20 max-xl:hidden w-full h-screen transition-opacity duration-300 ease-out`}
              >
                {followersUsers.length < 1 ? (
                  <div className="h-[20rem] max-md:text-center flex flex-col items-center gap-y-[1rem] justify-center md:px-[2rem]">
                    <BellIcon
                      className={"w-6 h-6 stroke-black dark:stroke-white"}
                    />
                    <h1 className="text-xl capitalize font-semibold dark:text-white text-center">
                      There are no notifications to show.
                    </h1>
                    <p className="text-lg dark:text-white text-center opacity-40">
                      Here the people who start to follow you will be shown.
                    </p>
                  </div>
                ) : (
                  followersUsers.map((element, key) => (
                    <a href={"/" + element._id}>
                      <div
                        className="flex justify-between  py-10 px-4 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10"
                        key={element._id}
                      >
                        <div className="flex w-full items-center ">
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
                        </div>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </>
          }
        />
      )}
    </>
  );
};
