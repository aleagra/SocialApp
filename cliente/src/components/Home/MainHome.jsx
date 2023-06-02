import React from "react";
import { Aside, AsideRight, HomeCenter } from ".";
import NavResponsive from "../Navbar/NavResponsive";

const MainHome = () => {
  return (
    <>
      <section className="flex min-h-screen h-full">
        <div className="fixed z-20">
          <Aside />
          <NavResponsive />
        </div>
        <HomeCenter />
        <AsideRight />
      </section>
    </>
  );
};

export default MainHome;
