import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BarsIcon,
  BellIcon,
  HomeIcon,
  PenIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from "../../utilities";
import ChatIcon from "../../utilities/icons/ChatIcon";

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const secondModalRef = useRef(null);

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

  const renderNavLinks = () => {
    return navLinks.map((link, index) => (
      <li
        key={index}
        className="cursor-pointer text-xl max-2xl:text-sm font-bold flex items-center"
      >
        <Link
          to={link.to}
          className="flex gap-4 p-8 max-lg:p-2 hover:bg-white/20 px-24 max-2xl:px-6 w-full color font-bold"
        >
          {link.icon}
          <span>{link.text}</span>
        </Link>
      </li>
    ));
  };

  return (
    <>
      <div className="fixed top-0 z-10 left-0 w-[20%] h-full border-r max-lg:hidden border-white/20 dark:text-white bg-[#17181c]">
        <div className="flex h-fit px-24 max-2xl:px-4 max-lg:px-0 py-12 w-full items-center">
          <Link to="/" className="flex gap-2">
            <img src="icon.png" className="w-10 h-10" alt="" />
            <p className="text-2xl uppercase dark:text-white">SocialApp</p>
          </Link>
        </div>
        <div className="w-full h-fit ">
          <ul className="flex flex-col uppercase">
            {renderNavLinks()}

            <li
              className="p-8 px-24 h-fit w-full mb-16 text-xl absolute bottom-0 flex gap-4 font-bold cursor-pointer hover:bg-white/40"
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
              className={`bg-[#1e1f23] px-6 py-6 rounded-xl shadow-xl modal-content z-20 w-[18rem] h-fit transition-opacity  duration-300 ease-out`}
            >
              <div className="flex flex-col">
                <Link
                  to="/chat"
                  className="flex items-center gap-4 p-4 hover:bg-white/40"
                >
                  <UsersIcon />
                  <span className="text-xl font-bold">About me</span>
                </Link>
                <Link
                  className="flex items-center gap-4 p-4 hover:bg-white/40"
                  onClick={() => {
                    setSecondModalOpen(true);
                    setIsOpen(false);
                  }}
                >
                  <PenIcon />
                  <p className="text-xl font-bold">View</p>
                </Link>
                <Link
                  to="/chat"
                  className="flex items-center gap-4 p-4 hover:bg-white/40"
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
          <div className="fixed inset-0 flex items-center left-20 top-[38rem]">
            <div
              ref={secondModalRef}
              className="bg-[#1e1f23] px-10 py-6 rounded-xl shadow-xl modal-content z-20 w-[18rem] h-fit"
            >
              {/* Contenido del segundo modal */}
            </div>
          </div>
        )}
      </div>
      {/* <Notifications /> */}
    </>
  );
};

export default Aside;
