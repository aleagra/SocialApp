import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiObject, event) => {
    setMsg((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <section className="flex w-full px-12 items-center relative">
      <label>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 fill cursor-pointer absolute top-[3.25rem] left-16 hover:bg-white/30 hover:rounded-md"
          onClick={() => setShowPicker((val) => !val)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
          />
        </svg>
      </label>

      {showPicker && (
        <Picker
          pickerStyle={{ width: "100%" }}
          onEmojiClick={handleEmojiClick}
        />
      )}

      <form className="flex h-16 w-full " onSubmit={sendChat}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className=" border-2 rounded-lg  px-14 w-full focus:outline-none dark:text-white text-lg bg-transparent border-black/10 dark:border-white/30"
        />
        <button type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-9 h-9 fill absolute top-12 right-16 z-10 hover:bg-white/30 hover:rounded-md"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
            />
          </svg>
        </button>
      </form>
    </section>
  );
}
