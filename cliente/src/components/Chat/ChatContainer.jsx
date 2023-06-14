import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.post(
        `https://socialapp-backend-production-a743.up.railway.app/messages/getmsg`,
        {
          from: user,
          to: currentChat._id,
        }
      );
      setMessages(response.data);
    };

    fetchMessages();
  }, [currentChat, user]);

  const handleSendMsg = async (msg) => {
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: user,
      msg,
    });

    await axios.post(
      "https://socialapp-backend-production-a743.up.railway.app/messages/addmsg",
      {
        from: user,
        to: currentChat._id,
        message: msg,
      }
    );

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container className="bg-[#f5f4f2] dark:bg-[#0a0a13]">
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved "
                }`}
              >
                <div className="content max-xl: border-[1px] text-white dark:border-white/30 bg-black ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 75% 20%;
  gap: 0.1rem;

  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
    }
  }
  .chat-messages {
    padding: 4rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 100%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: var(--bg-color);
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        //
      }
    }
  }
`;
