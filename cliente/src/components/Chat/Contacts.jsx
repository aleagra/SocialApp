import React, { useState } from "react";
import { ReactSVG } from "react-svg";
export default function Contacts({ contacts, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      <section className=" grid 2xl:grid-rows-[10%,85%,5%] grid-rows-[20%,75%] max-xl:grid-rows-[90%,10%] bg-white dark:bg-[#131324]">
        <div className="flex justify-center items-center my-4 gap-[2rem] max-xl:hidden  border-b border-white/30">
          <h3 className="text-black dark:text-white font-bold max-xl:hidden ">
            CHATS
          </h3>
        </div>
        <div className="flex flex-col max-xl:overflow-x-hidden gap-[0.8rem] max-xl:overflow-y-scroll">
          {contacts.map((contact, index) => {
            return (
              <div
                key={contact._id}
                className={`contact max-xl:flex-col max-xl:gap-2 max-xl:p-2 max-xl:my-4 pl-10 ${
                  index === currentSelected
                    ? "dark:bg-white/10 bg-gray-100 w-full px-3 py-6 text flex items-center gap-6  cursor-pointer "
                    : " text-black dark:text-white px-3 py-6 flex items-center gap-6 cursor-pointer "
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
                  <h3 className="uppercase">{contact.username}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
