import React, { useContext } from "react";
import Robot from "../../assets/robot.gif";
import { AuthContext } from "../../context/AuthContext";
export default function Welcome() {
  const { userData } = useContext(AuthContext);

  return (
    <section className="flex justify-center items-center text-black dark:bg-[#0a0a13] border-l border-white/20 flex-col fondo dark:text-white">
      <img src={Robot} alt="" className="h-[20rem]" />
      <h1>
        Welcome, <span className="text">{userData?.username}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </section>
  );
}
