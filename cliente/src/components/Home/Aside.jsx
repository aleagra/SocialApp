import React, { useState, useEffect, useRef } from "react";
import { Bars, Bell, HomeIcon, SearchIcon, UserIcon } from "../../utilities";
import ChatIcon from "../../utilities/icons/ChatIcon";
import { Link } from "react-router-dom";

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

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

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 z-10 left-0 w-[20%] h-full border-r border-white/20 dark:text-white">
        <div className="flex h-fit px-24 py-16 w-full items-center gap-2">
          <img src="icon.png" className="w-10 h-10" alt="" />
          <p className="text-2xl uppercase dark:text-white">SocialApp</p>
        </div>
        <div className="w-full h-fit">
          <ul className="flex flex-col uppercase">
            <li className="py-8 px-24  text-xl font-semibold flex items-center gap-4">
              <HomeIcon />
              <span>home</span>
            </li>
            <li className="p-8 px-24  text-xl font-semibold flex items-center gap-4">
              <SearchIcon />
              <span>buscar</span>
            </li>
            <li className="p-8 px-24  text-xl font-semibold flex items-center gap-4">
              <ChatIcon />
              <span>chat</span>
            </li>

            <li className="p-8 px-24  text-xl font-semibold flex items-center gap-4">
              <Bell />
              <span>Notifications</span>
            </li>
            <li className="p-8 px-24  text-xl font-semibold flex items-center gap-4 hover:bg-white/40">
              <UserIcon />
              <span>perfil</span>
            </li>
            <li
              className="p-8 px-24  pb-16 text-xl absolute bottom-0 flex gap-4 font-semibold cursor-pointer"
              onClick={openModal}
            >
              <Bars />
              <span className="">mas</span>
            </li>
          </ul>
        </div>
        {isOpen && (
          <div className="fixed inset-0 flex items-center left-20 top-[28rem]">
            <div
              ref={modalRef}
              className="bg-[#1e1f23] px-10 py-6 rounded-xl shadow-xl modal-content z-20 w-[18rem] h-fit "
            >
              <div className="flex flex-col">
                <Link to="/chat" className="text-whte p-4">
                  CHat
                </Link>
                <Link to="/chat" className="text-whte p-4">
                  CHat
                </Link>
                <Link to="/chat" className="text-whte p-4">
                  CHat
                </Link>
                <Link to="/chat" className="text-whte p-4">
                  CHat
                </Link>
              </div>
            </div>
            <div className="fixed inset-0 " onClick={closeModal}></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Aside;
