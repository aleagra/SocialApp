import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProfileUsers() {
  let { id } = useParams();
  const url = `http://localhost:5050/users/${id}`;
  const [profile, setProfile] = useState({
    currentUserImage: undefined,
    currentUserName: undefined,
    description: undefined,
    followers: undefined,
    following: undefined,
    background: undefined,
  });

  useEffect(() => {
    async function fetchUser() {
      const { data } = await axios.get(url);
      const {
        username,
        descripcion,
        background,
        avatarImage,
        followers,
        following,
      } = data;
      setProfile({
        ...data,
        currentUserImage: avatarImage,
        currentUserName: username,
        description: descripcion,
        background: background,
        followers: followers.length,
        following: following.length,
      });
    }
    fetchUser();
  }, []);

  return (
    <section>
      <Navbar />
      <div className="relative pb-2 h-full mt-20 justify-center items-center">
        <div className="flex flex-col pb-5 dark:text-white">
          <div className="relative flex flex-col mb-7">
            <div className="flex flex-col justify-center items-center">
              <img
                src={profile.background}
                alt=""
                className="w-full h-60 2xl:h-510 shadow-lg object-cover rounded-lg"
              />
              <img
                src={`data:image/svg+xml;base64,${profile.currentUserImage}`}
                className="rounded-full w-40 h-40 -mt-10 shadow-2xl object-cover"
                alt=""
              />
              <h1 className="font-bold text-3xl text-center mt-3 mb-10">
                {profile.currentUserName}
              </h1>
              <h5 className="text-center mb-8 mt-0">{profile.description}</h5>
              <div className="flex justify-center gap-9">
                <div className="flex w-[33%] flex-col items-center">
                  <h1 className="text-lg font-bold">{profile.following}</h1>
                  <h3 className="text-xs font-extralight opacity-60">
                    Followers
                  </h3>
                </div>
                <div className="flex w-[33%] flex-col items-center">
                  <h1 className="text-lg font-bold">{profile.followers}</h1>
                  <h3 className="text-xs font-extralight opacity-60">
                    Following
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileUsers;
