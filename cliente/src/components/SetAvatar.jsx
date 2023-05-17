import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
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
    const asyncFn = async () => {
      if (!localStorage.getItem(import.meta.env.REACT_APP_LOCALHOST_KEY))
        navigate("/login");
    };
    asyncFn();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(import.meta.env.REACT_APP_LOCALHOST_KEY)
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          import.meta.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const asyncFn = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
      data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
    asyncFn();
  }, []);
  return (
    <>
      {isLoading ? (
        <section className="flex justify-center items-center flex-col gap-[3rem] bg-[#131324] h-[100vh] w-[100vw]">
          <img src={loader} alt="loader" className="loader" />
          </section>
      ) : (
        <section className="flex justify-center items-center flex-col gap-[3rem] bg-[#131324] h-[100vh] w-[100vw]">
          <div className="text-white">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="flex gap-[2rem]">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={` border-2 p-[0.4rem] rounded-full flex justify-center items-center transition-all ease-in  ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img 
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    className="h-[6rem] "
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="bg-[#4e0eff] text-white py-[1rem] px-[2rem] border-none font-bold text-[1rem] uppercase :hover:bg-[#4e0eff]
">
            Set as Profile Picture
          </button>
          <ToastContainer />
       </section>
      )}
    </>
  );
}

