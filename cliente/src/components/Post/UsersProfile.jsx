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
    <section className="flex">
      <div className="fixed z-20">
        <Aside />
      </div>
      <div className="relative w-full justify-center items-center min-h-screen h-screen ">
        <div className="flex flex-col dark:bg-[#131324] h-full dark:text-white ml-[35%] mr-[15%] max-lg:m-0 max-lg:overflow-hidden">
          <div className="relative mb-[4rem] pt-20 flex flex-col">
            <div className="flex flex-col  relative bg-white dark:bg-[#0a0a13] rounded-lg shadow-md">
              <div className="w-full h-fit py-12 justify-center relavite flex items-center gap-16">
                <div className="flex items-end">
                  <ReactSVG
                    src={`data:image/svg+xml;base64,${btoa(
                      profile.avatarImage
                    )}`}
                    className="color-item rounded-full w-[8rem] h-[8rem]"
                  />
                </div>
                <div className="flex flex-col p-2 text-center text-xl w-[220px]">
                  <h1 className="font-bold capitalize whitespace-nowrap">
                    {profile.fullName}
                  </h1>
                  <h1 className="font-light capitalize">@{profile.username}</h1>
                </div>
                <div className="flex text-center text-xl gap-2 flex-col">
                  <span className="font-bold">{profile.followers}</span>
                  <p>Followers </p>
                </div>
                <div className="flex cursor-pointer text-center text-xl gap-2 flex-col">
                  <span className="font-bold">{profile.following}</span>
                  <p>Followings </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-y-12 pb-20 flex-col w-full justify-center  items-center">
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
