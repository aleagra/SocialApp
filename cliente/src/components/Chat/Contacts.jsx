import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ReactSVG } from "react-svg";
export default function Contacts({ contacts, changeChat }) {
  const { userData } = useContext(AuthContext);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      <section className=" grid 2xl:grid-rows-[10%,75%,15%] grid-rows-[20%,75%,5%] max-xl:grid-rows-[75%,10%] overflow-hidden bg-white dark:bg-[#131324]">
        <div className="flex justify-center items-center my-4 gap-[2rem] max-xl:hidden  border-b border-white/30">
          <h3 className="text-black dark:text-white font-bold max-xl:hidden ">CHATS</h3>
        </div>
        <div className="flex flex-col overflow-auto gap-[0.8rem]">
          {contacts.map((contact, index) => {
            return (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected
                    ? "dark:bg-white/20 bg-black/10 w-full px-3 py-6 text flex items-center gap-6 xl:pl-16 cursor-pointer"
                    : " text-black dark:text-white px-3 py-6 max-xl:px-5 max-xl:py-4 max-xl:pl-5 flex items-center  gap-6 xl:pl-16 cursor-pointer"
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div>
                  <ReactSVG
                    src={`data:image/svg+xml;base64,${btoa(
                      contact.avatarImage
                    )}`}
                    className="color-item  rounded-full w-16 h-16"
                  />
                </div>
                <div className=" font-bold text-lg">
                  <h3 className="uppercase max-xl:hidden">{contact.username}</h3>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="flex items-center justify-center gap-[2rem] container">
          <div className="">
            <img
              className="h-12 w-12"
              src={`data:image/svg+xml;base64,${user.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div
            className="font-bold text-xl text-white uppercase
            "
          >
            <h2>{user.username}</h2>
          </div>
        </div> */}
      </section>
    </>
  );
}
