import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ReactSVG } from "react-svg";
import NavResponsive from "./NavResponsive";
import Wrapper from "../../wrapper/wrapper";
import Aside from "../Home/Aside";
import AsideRight from "../Home/AsideRight";

function Search() {
  const { user } = useContext(AuthContext);
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
        const allUsers = response.data;
        const filteredUsers = allUsers.filter((users) => users._id !== user);
        setUsers(filteredUsers);
      } catch (error) {
        console.error(error);
      }
    }

    obtenerUsuarios();
  }, []);

  useEffect(() => {
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
      <div className="w-[300px] fixed">
        <Aside />
        <NavResponsive />
      </div>
      <section className="w-full rounded-md my-[4rem] max-xl:m-0 xl:col-start-2">
        <div className="flex justify-center py-12 ">
          <input
            placeholder="Search"
            className="text-black dark:bg-transparent dark:text-white focus:outline-none px-6 py-2 mx-10 border-2 dark:border-white/20 w-full rounded-lg"
            onChange={(e) => setBuscar(e.target.value)}
            value={buscar}
            type="search"
          />
        </div>
        <div className="flex flex-col w-full max-h-[calc(100vh-18rem)] max-2xl:max-h-[calc(100vh-12rem)] max-md:max-h-[calc(100vh-13rem)] rounded-lg cursor-pointer overflow-y-scroll">
          {buscar &&
            users?.map((Element, index) => {
              const regex = new RegExp(
                `^.*${buscar.toLowerCase().split("").join(".*")}.*$`,
                "i"
              );
              if (regex.test(Element.username.toLowerCase())) {
                return (
                  <a
                    className="w-full dark:border-gray-100/20 hover:bg-gray-100 dark:hover:bg-white/10"
                    onClick={(e) => {
                      search(Element._id);
                    }}
                  >
                    <div className="w-full m-auto">
                      <div className="flex items-center gap-2 justify-center py-6">
                        <ReactSVG
                          src={`data:image/svg+xml;base64,${btoa(
                            Element.avatarImage
                          )}`}
                          className="color-item  rounded-full w-20 h-auto"
                        />
                        <div className="flex flex-col px-6 max-md:px-2">
                          <h1 className="text-2xl font-semibold dark:text-white capitalize max-md:text-xl">
                            {Element.fullName}
                          </h1>
                          <h1 className="text-2xl font-light capitalize dark:text-white max-md:text-lg">
                            @{Element.username}
                          </h1>
                          <div className="flex items-center gap-4 text-black/50 dark:text-white">
                            <h1 className="text-xl">
                              {Element.followers.length}
                            </h1>
                            <h3 className="text-xl text-black/40 dark:text-white/30">
                              Followers
                            </h3>

                            <h1 className="text-xl font-bold">
                              {Element.following.length}
                            </h1>
                            <h3 className="text-xl text-black/40 dark:text-white/30">
                              Following
                            </h3>
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
              <div className="h-[128px]  flex items-center dark:text-white justify-center">
                <p className="text-xl">User not found.</p>
              </div>
            )}
        </div>
      </section>
      <div className="xl:col-start-3 w-full">
        <AsideRight />
      </div>
    </>
  );
}
export default Wrapper(
  Search,
  "relative h-screen grid grid-cols-[300px,1fr,400px,] gap-[4rem] max-2xl:grid-cols-[300px,1fr] max-xl:max-2xl:grid-cols-[1fr]"
);
