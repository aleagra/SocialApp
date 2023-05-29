import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
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
        const selectedIndices = [];

        // Generar 5 índices aleatorios únicos
        while (selectedIndices.length < 5) {
          const randomIndex = Math.floor(Math.random() * totalAvatars);
          if (!selectedIndices.includes(randomIndex)) {
            selectedIndices.push(randomIndex);
          }
        }

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
      } catch (error) {
        console.error("Error al generar los avatares:", error);
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
      <section className="flex justify-center items-center flex-col gap-[3rem] bg-[#f7f7f7]  dark:bg-[#0a0a13] h-[100vh] w-[100vw]">
        <div className="flex flex-col w-full h-full gap-y-20 justify-center items-center">
          <div className="text">
            <h1 className="text-5xl font-semibold">
              Select an avatar as your profile image
            </h1>
          </div>
          <div className="w-full justify-center flex gap-5">
            {avatars.map((avatar, index) => (
              <ReactSVG
                key={index}
                src={`data:image/svg+xml;base64,${btoa(avatar)}`}
                style={{ width: "10%", height: "auto" }}
                className={`p-7 pb-9 rounded-full cursor-pointer bg-white  shadow-sm ${
                  avatar === selectedAvatar ? "color-item z-20" : ""
                }`}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div>
          <button
            onClick={() => setProfilePicture(dispatch)} // Llamada a setProfilePicture con el dispatch como argumento
            className="text-white py-[1rem] px-[2rem] border-none font-bold text-[1rem] rounded-xl uppercase color-item"
          >
            Finish
          </button>
          <ToastContainer />
        </div>
      </section>
    </>
  );
}
