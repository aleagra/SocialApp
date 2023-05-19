import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Post from "../Post/Post";
import UserPost from "../Post/UserPost";
import { AuthContext } from "../../context/AuthContext";

export function HomeCenter() {
  const { user } = useContext(AuthContext);
  const url = `http://localhost:5050/posts/friends/${user._id}`;
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
      <div className=" max-ms:px-0 flex my-[4rem] ml-[25%] mr-[32%] w-full flex-col max-lg:w-[70%] max-md:pl-0 max-sm:w-[95%] items-center ">
        <UserPost />
        <div className="flex gap-y-12 flex-col w-full justify-center m-auto items-center">
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
    </>
  );
}
