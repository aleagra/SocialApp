import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Aside, AsideRight, HomeCenter } from "../components/Home";

const MainHome = () => {
  return (
    <>
      <Navbar />
      <section className="flex justify-center my-[8rem]">
        <Aside />
        <HomeCenter />
        <AsideRight />
      </section>
    </>
  );
};

export default MainHome;
