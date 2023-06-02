import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Aside, AsideRight } from "../Home";
import { AuthContext } from "../../context/AuthContext";
import { ReactSVG } from "react-svg";
import NavResponsive from "./NavResponsive";
export function Search() {
  const [users, setUsers] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [usuariosEncontrados, setUsuariosEncontrados] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    async function obtenerUsuarios() {
      try {
        const response = await axios.get(
          "http://localhost:5050/users/allusers"
        );
        setUsers(response.data);
        console.log(users);
      } catch (error) {
        console.error(error);
      }
    }

    obtenerUsuarios();
  }, []);

  useEffect(() => {
    // Verificar si se encontraron usuarios
    const usuariosFiltrados = users.filter((Element) =>
      Element.username.trim().toLowerCase().startsWith(buscar.toLowerCase())
    );
    setUsuariosEncontrados(usuariosFiltrados.length > 0);
  }, [buscar, users]);

  function search(id) {
    navigate("/" + id);
  }
  return (
    <>
      <section className="flex h-fit">
        <Aside />
        <NavResponsive />
        <section className="w-full xl:ml-[8%] max-2xl:-[10%] rounded-md mr-[32%] max-2xl:mr-[10%] my-14 bg-white dark:bg-[#0a0a13] max-md:p-0 max-md:m-0">
          <div className="flex flex-col items-center ">
            <div className="flex w-full justify-center py-12">
              <input
                placeholder="Search"
                className="text-black dark:bg-transparent dark:text-white focus:outline-none px-6 py-2 mx-10 border-2 dark:border-white/20 w-full rounded-lg"
                onChange={(e) => setBuscar(e.target.value)}
                value={buscar}
                type="search"
              />
            </div>
            <div className=" flex flex-col w-full rounded-lg justify-center cursor-pointer">
              {buscar &&
                users?.map((Element, index) => {
                  const regex = new RegExp(
                    `^.*${buscar.toLowerCase().split("").join(".*")}.*$`,
                    "i"
                  );
                  if (regex.test(Element.username.toLowerCase())) {
                    return (
                      <a
                        className="w-full hover:bg-black/10 hover:shadow-md dark:hover:bg-[#131324] dark:hover:border dark:hover:border-white/20"
                        onClick={(e) => {
                          search(Element._id);
                        }}
                      >
                        <div className="w-full  m-auto  ">
                          <div className="flex items-center gap-2 py-6 justify-center">
                            <ReactSVG
                              src={`data:image/svg+xml;base64,${btoa(
                                Element.avatarImage
                              )}`}
                              className="color-item  rounded-full w-20 h-auto"
                            />
                            <div className="flex flex-col px-6">
                              <h1 className="text-2xl font-semibold dark:text-white">
                                {Element.fullName}
                              </h1>
                              <h1 className="text-2xl font-light capitalize dark:text-white">
                                @{Element.username}
                              </h1>
                              <div className="flex items-center gap-4 text-black/50 dark:text-white">
                                <h1 className="text-xl">
                                  {Element.followers.length}
                                </h1>
                                <h3 className="text-xl">Followers</h3>

                                <h1 className="text-xl font-bold">
                                  {Element.following.length}
                                </h1>
                                <h3 className="text-xl">Following</h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  }
                  return null;
                })}
              {users &&
                !users.some((Element) =>
                  new RegExp(
                    `^.*${buscar.toLowerCase().split("").join(".*")}.*$`,
                    "i"
                  ).test(Element.username.toLowerCase())
                ) && (
                  <div className="h-[128px] bg-[#f7f7f7] flex items-center dark:text-white justify-center dark:bg-[#0a0a13]">
                    <p className="text-xl">User not found.</p>
                  </div>
                )}
            </div>
          </div>
        </section>
        <AsideRight />
      </section>
    </>
  );
}
