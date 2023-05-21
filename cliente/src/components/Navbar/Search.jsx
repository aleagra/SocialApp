import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Aside, AsideRight } from "../Home";
import { AuthContext } from "../../context/AuthContext";
import { ReactSVG } from "react-svg";
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
    navigate("/Profile/" + id);
  }
  return (
    <>
      <section className="flex h-fit">
        <Aside />
        <section className="w-full ml-[25%] mr-[32%] my-14 bg-white">
          <div className="flex flex-col items-center ">
            <div className="flex w-full justify-center py-12">
              <input
                placeholder="Buscar"
                className="text-black focus:outline-none px-6 py-2 mx-10 border-2  w-full rounded-lg"
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
                        className="w-full hover:bg-black/10"
                        onClick={(e) => {
                          search(Element._id);
                        }}
                      >
                        <div className="w-full  m-auto  dark:bg-[#16181C]">
                          <div className="flex items-center gap-2 py-6 justify-center">
                            <ReactSVG
                              src={`data:image/svg+xml;base64,${btoa(
                                Element.avatarImage
                              )}`}
                              className="color-item  rounded-full w-16 h-auto"
                            />
                            <div className="flex flex-col px-6">
                              <h1 className="text-2xl font-semibold">
                                {Element.username}
                              </h1>
                              <div className="flex items-center gap-4 text-black/50">
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
                  <div className="h-[128px] bg-[#f7f7f7] flex items-center justify-center">
                    <p className="text-xl">No se encontraron usuarios.</p>
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
