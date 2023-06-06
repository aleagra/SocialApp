import React from "react";
import { Aside, AsideRight, HomeCenter } from ".";
import NavResponsive from "../Navbar/NavResponsive";

const MainHome = () => {
  return (
    <>
      <section className="min-h-screen relative h-full grid grid-cols-[300px,1fr,400px,] gap-[4rem] max-xl:grid-cols-1">
        <div className="w-[300px] fixed">
          <Aside />
          <NavResponsive />
        </div>
        <div className="xl:col-start-2 max-xl:px-12 max-md:p-5">
          <HomeCenter />
        </div>
        <div className="xl:col-start-3">
          <AsideRight />
        </div>
      </section>
    </>
  );
};

export default MainHome;
