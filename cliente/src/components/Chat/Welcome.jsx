import React, { useContext } from "react";
import Icon from "../../assets/icon.png";
import { AuthContext } from "../../context/AuthContext";
export default function Welcome() {
  const { userData } = useContext(AuthContext);

  return (
    <section className="flex  gap-2 justify-center items-center p-10 text-black dark:bg-[#0a0a13] bg-[#F5F2F2] border-l border-white/20 flex-col dark:text-white">
      <div>
        <img src={Icon} />
      </div>
      <h1 className="font-bold">
        Welcome, <span className="text">{userData?.username}!</span>
      </h1>
      <h3 className="text-center font-light">
        Please select a chat to start messaging.
      </h3>
    </section>
  );
}
