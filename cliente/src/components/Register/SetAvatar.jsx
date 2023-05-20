import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";



export default function SetAvatar() {
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
        const response = await axios.get('https://avatars.dicebear.com/api/male/:seed.svg?options');
        const avatars = Array.from({ length: 4 }, (_, index) => response.data.replace(':seed', index.toString()));
        setAvatars(avatars);
    console.log(avatars);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al generar los avatares:', error);
        setIsLoading(false);
      }
    };
    generateAvatars();
  }, []);

  
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Por favor, selecciona un avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem(import.meta.env.REACT_APP_LOCALHOST_KEY));

      try {
        const response = await axios.post(
          `http://localhost:5050/users/setavatar/${user._id}`,
          {
            image: avatars[selectedAvatar],
          }
        );

        if (response.data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = response.data.image;
          localStorage.setItem(import.meta.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(user));
          navigate("/");
        } else {
          toast.error("Error al establecer el avatar. Por favor, inténtalo de nuevo.", toastOptions);
        }
      } catch (error) {
        console.error('Error al establecer el avatar:', error);
        toast.error("Error al establecer el avatar. Por favor, inténtalo de nuevo.", toastOptions);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <section className="flex justify-center items-center flex-col gap-[3rem] bg-[#131324] h-[100vh] w-[100vw]">
          <img src={loader} alt="loader" className="loader" />
        </section>
      ) : (
        <section className="flex justify-center items-center flex-col gap-[3rem] bg-[#131324] h-[100vh] w-[100vw]">
          <div className="text-white">
            <h1>Selecciona un avatar como tu imagen de perfil</h1>
          </div>
          <div className="flex gap-[2rem]">
            {avatars.map((avatar, index) => (
              <div
                className={`border-2 p-[0.4rem] rounded-full flex justify-center items-center transition-all ease-in ${
                  selectedAvatar === index ? "selected" : ""
                }`}
                key={index} // Utiliza el índice como clave única
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  className="h-[6rem]"
                />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="bg-[#4e0eff] text-white py-[1rem] px-[2rem] border-none font-bold text-[1rem] uppercase hover:bg-[#4e0eff]"
          >
            Establecer como imagen de perfil
          </button>
          <ToastContainer />
        </section>
      )}
    </>
  );
  
}