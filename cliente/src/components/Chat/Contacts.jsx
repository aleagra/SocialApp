import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
export default function Contacts({ contacts, changeChat }) {
  const { user } = useContext(AuthContext);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      <section className=" grid grid-rows-[10%,75%,15%] mt-5 overflow-hidden bg-white dark:bg-[#16181C] ">
        <div className="flex justify-center items-center mt-4 gap-[2rem] ">
          <h3 className="text-black dark:text-white font-bold ">CHATS</h3>
        </div>
        <div className="flex flex-col overflow-auto gap-[0.8rem]">
          {contacts.map((contact, index) => {
            return (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected
                    ? "container w-full p-3 text-white dark:text-black flex items-center  gap-[2rem]"
                    : " text-black dark:text-white flex items-center mx-3 px-5 py-2  gap-[3rem]"
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div>
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt=""
                    className="h-[4rem]"
                  />
                </div>
                <div className=" font-bold text-lg">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-[2rem] container">
          <div className="">
            <img
              className="h-[4rem] inline"
              src={`data:image/svg+xml;base64,${user.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div
            className="text-white uppercase
            "
          >
            <h2>{user.username}</h2>
          </div>
        </div>
      </section>
    </>
  );
}
