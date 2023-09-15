import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { EmojiIcon, SendIcon } from "../../utilities";

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
    <section className="flex w-full px-12 pb-10 max-xl:px-5 relative z-0 items-end">
      {showPicker && <Picker onEmojiClick={handleEmojiClick} />}

      <form
        className="flex h-16 w-full relative max-md:h-8"
        onSubmit={sendChat}
      >
        <div onClick={() => setShowPicker((val) => !val)}>
          <EmojiIcon />
        </div>
        <input
          type="text"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className=" border-2 rounded-lg  px-14 max-md:px-8 max-md:text-sm w-full focus:outline-none dark:text-white text-lg bg-transparent border-black/10 dark:border-white/30"
        />
        <button type="submit">
          <SendIcon />
        </button>
      </form>
    </section>
  );
}
