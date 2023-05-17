import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { ChatContainer, Contacts, Welcome } from "../components/Chat";

export default function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      socket.current = io("http://localhost:5050");
      socket.current.emit("add-user", user._id);
    }
  }, [user]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (user) {
        const response = await axios.get(
          `http://localhost:5050/users/allusers`
        );
        const users = response.data.filter((u) => u._id !== user._id);
        setContacts(users);
      }
    };

    fetchContacts();
  }, [user]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <section className="h-screen w-full flex flex-col justify-center gap-[1rem] items-center bg-[#131324] ">
        <div className="h-full w-[100vw] bg-[#00000076] mt-[3%] grid grid-cols-[25%,75%]">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </section>
    </>
  );
}
