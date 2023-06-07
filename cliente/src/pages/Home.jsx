import React from "react";
import { Aside, AsideRight, HomeCenter } from "../components/Home";
import NavResponsive from "../components/Navbar/NavResponsive";
import Wrapper from "../wrapper/wrapper";

function Home() {
  return (
    <>
      <div className="w-[300px] fixed z-20">
        <Aside />
        <NavResponsive />
      </div>
      <div className="xl:col-start-2 max-xl:px-6 max-md:p-0">
        <HomeCenter />
      </div>
      <div className="xl:col-start-3 max-xl:hidden">
        <AsideRight />
      </div>
    </>
  );
}

export default Wrapper(
  Home,
  "relative h-full grid grid-cols-[300px,1fr,400px,] gap-[4rem] max-2xl:grid-cols-[300px,1fr] max-xl:max-2xl:grid-cols-[1fr]"
);
