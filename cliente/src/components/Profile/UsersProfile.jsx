import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserPosts from "./UserPosts";

function ProfileUsers() {
  let { id } = useParams();
  const url = `http://localhost:5050/users/${id}`;
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [description, setdescription] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [followers, setFollow] = useState(undefined);
  const [following, setFollowing] = useState(undefined);
  const [background, setBackground] = useState(undefined);

  useEffect(() => {
    async function productosDB() {
      const data = await axios.get(url);
      setProfile(data.data);
      setCurrentUserName(data.data.username);
      setdescription(data.data.descripcion);
      setBackground(data.data.background);
      setCurrentUserImage(data.data.avatarImage);
      setFollow(data.data.followers.length);
      setFollowing(data.data.following.length);
    }
    productosDB();
  }, []);

  return (
    <section>
      <Navbar />
      <div className="relative pb-2 h-full mt-20 justify-center items-center">
        <div className="flex flex-col pb-5 dark:text-white">
          <div className="relative flex flex-col mb-7">
            {/* imagen de fondo */}
            <div className="flex flex-col justify-center items-center">
              <img
                src={background} //hacerlo dinamico con la db
                alt=""
                className="w-full h-60 2xl:h-510 shadow-lg object-cover rounded-lg"
              />
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                className="rounded-full w-40 h-40 -mt-10 shadow-2xl object-cover"
                alt=""
              />
              <h1 className="font-bold text-3xl text-center mt-3 mb-10">
                {currentUserName}
              </h1>
              <h5 className=" text-center mb-8 mt-0">{description}</h5>
              <div className="flex justify-center gap-9">
                <div className="flex w-[33%] flex-col items-center">
                  <h1 className="text-lg font-bold">{following}</h1>
                  <h3 className="text-xs font-extralight opacity-60">
                    Followers
                  </h3>
                </div>
                <div className="flex w-[33%] flex-col items-center">
                  <h1 className="text-lg font-bold">{followers}</h1>
                  <h3 className="text-xs font-extralight opacity-60">
                    Following
                  </h3>
                </div>
              </div>
            </div>

            {/* botones */}
            <div className="text-center mb-7">
              <UserPosts />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileUsers;
