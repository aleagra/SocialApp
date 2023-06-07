import React from "react";
import { Aside, AsideRight, HomeCenter } from "../components/Home";
import NavResponsive from "../components/Navbar/NavResponsive";
import Wrapper from "../wrapper/wrapper";

function Home() {
  return (
    <>
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
    </>
  );
}

export default Wrapper(
  Home,
  "relative h-full grid grid-cols-[300px,1fr,400px,] gap-[4rem]"
);
