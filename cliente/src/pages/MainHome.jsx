import React from "react";
import { Aside, AsideRight, HomeCenter } from "../components/Home";

const MainHome = () => {
  return (
    <>
      {/* <Navbar /> */}
      <section className="flex min-h-screen h-full">
        <div className="fixed">
          <Aside />
        </div>
        <HomeCenter />
        <AsideRight />
      </section>
    </>
  );
};

export default MainHome;
