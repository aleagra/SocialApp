import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import loader from "../../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { v4 as uuidv4 } from "uuid";
import { Fetching } from "../../context/AuthActions";

export default function SetAvatar() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const generateAvatars = async () => {
      try {
        const totalAvatars = 100;
        const selectedIndices = Array.from({ length: 5 }, () =>
          Math.floor(Math.random() * totalAvatars)
        );

        const avatars = await Promise.all(
          selectedIndices.map(async (index) => {
            const randomParam = uuidv4();
            const response = await axios.get(
              `https://avatars.dicebear.com/api/adventurer/${index}.svg?options&randomSeed=${randomParam}`
            );
            return response.data;
          })
        );

        setAvatars(avatars);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al generar los avatares:", error);
        setIsLoading(false);
      }
    };
    generateAvatars();
  }, []);

  const setProfilePicture = async () => {
    try {
      dispatch(Fetching());

      const response = await axios.post(
        `http://localhost:5050/users/setavatar/${user}`,
        {
          image: selectedAvatar,
        }
      );

      dispatch({ type: "SET_USER", payload: response.data });
      dispatch(Fetching());
      navigate("/");
      location.reload();
    } catch (error) {
      console.error("Error al establecer el avatar:", error);
      toast.error(
        "Error al establecer el avatar. Por favor, inténtalo de nuevo.",
        toastOptions
      );
    }
  };

  return (
    <>
      <section className="flex justify-center items-center flex-col gap-[3rem] bg-[#131324] h-[100vh] w-[100vw]">
        <div className="text-white">
          <h1>Selecciona un avatar como tu imagen de perfil</h1>
        </div>
        <div className="w-full justify-center flex gap-5">
          {avatars.map((avatar, index) => (
            <ReactSVG
              key={index}
              src={`data:image/svg+xml;base64,${btoa(avatar)}`}
              style={{ width: "10%", height: "auto" }}
              className="p-7 pb-9  rounded-full hover:bg-slate-50 cursor-pointer"
              onClick={() => setSelectedAvatar(avatar)}
            />
          ))}
        </div>
        <button
          onClick={() => setProfilePicture(dispatch)} // Llamada a setProfilePicture con el dispatch como argumento
          className=" text-white py-[1rem] px-[2rem] border-none font-bold text-[1rem] uppercase container"
        >
          Establecer como imagen de perfil
        </button>
        <ToastContainer />
      </section>
    </>
  );
}
