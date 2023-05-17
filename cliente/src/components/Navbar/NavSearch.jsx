import React from "react";
import { useState } from "react";
const NavSearch = () => {
  const [buscar, setBuscar] = useState("");
  return (
    <div className=" relative rounded-full bg-[#F3F5F7] p-2 max-lg:hidden">
      <a
        className="absolute top-2 right-4 "
        href={buscar === "" ? "/" : "/Search/" + buscar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="gray"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </a>
      <label className="flex ">
        <input
          placeholder="Buscar"
          className="bg-transparent pl-4 pr-10 text-black focus:outline-none "
          onChange={(e) => setBuscar(e.target.value)}
          value={buscar}
          type="text"
        />
      </label>
    </div>
  );
};

export default NavSearch;
