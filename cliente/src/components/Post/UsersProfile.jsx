import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Aside } from "../Home";
import Post from "./Post";
import { ReactSVG } from "react-svg";
function ProfileUsers() {
  const [data, setData] = useState([]);
  let { id } = useParams();
  const posts = `http://localhost:5050/posts/user/${id}`;
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

  const fetchData = async () => {
    const res = await axios.get(posts);
    setData(
      res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
    );
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <section>
      <Aside />
      <div className="relative justify-center items-center min-h-screen h-screen ">
        <div className="flex flex-col dark:bg-[#17181c] h-full dark:text-white mt-12 ml-[35%] mr-[15%] max-lg:m-0 max-lg:overflow-hidden">
          <div className="relative mb-[4rem] flex flex-col border-2  border-white/30">
            <div className="flex flex-col pt-4 relative items-centee">
              <img
                src={profile.background}
                alt=""
                className="min-h-[250px] max-h-[250px] w-[100%] object-cover"
              />
              <div className="w-full h-[7rem] rounded-md shadow-lg flex justify-end items-center bg-white">
                <ReactSVG
                  src={`data:image/svg+xml;base64,${btoa(profile.avatarImage)}`}
                  className="color-item  rounded-full w-[8rem] h-auto absolute left-10 bottom-10"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-y-12 pb-20 flex-col w-full justify-center m-auto items-center">
            {data.map((post, key) => {
              return (
                <>
                  {post.video ? (
                    <video controls width="auto" key={post.id}>
                      <source src={post.video} />
                    </video>
                  ) : (
                    ""
                  )}

                  {post?.user?.map((user, key) => {
                    return (
                      <>
                        <Post
                          key={post.id}
                          post={post}
                          userprofile={user}
                          video={post.video}
                        />
                      </>
                    );
                  })}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileUsers;
