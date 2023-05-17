import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Post from "../Post/Post";
import UserPost from "../Post/UserPost";

export function HomeCenter() {
  const url = "http://localhost:5050/posts/";
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(url);
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
    //trae todos los posts de los users
    <>
      <div className=" max-ms:px-0 flex h-[50%]  w-[55%] flex-col gap-y-8 py-[2%] px-[2%] max-lg:w-[70%] max-md:pl-0 max-sm:w-[95%] items-center ">
        <UserPost />

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
    </>
  );
}
