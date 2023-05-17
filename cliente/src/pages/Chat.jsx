import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { AuthContext } from "../context/AuthContext";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      socket.current = io(host);
      socket.current.emit("add-user", user._id);
    }
  }, [user]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (user) {
        const response = await axios.get(`${allUsersRoute}`);
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
