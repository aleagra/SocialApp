import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Post from "../Post/Post";
import UserPost from "../Post/UserPost";
import { AuthContext } from "../../context/AuthContext";

export function HomeCenter() {
  const { user } = useContext(AuthContext);
  const url = `http://localhost:5050/posts/friends/${user}`;
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
      <div className=" max-sm:mx-0 max-sm:px-6 flex my-[4rem] lg:ml-[25%] md:ml-[12%] lg:mr-[32%] md:mr-[12%] max-md:mx-16 max-md:justify-center w-full flex-col max-md:w-[100%] items-center ">
        <UserPost />
        <div className="flex gap-y-12 flex-col w-full justify-center items-center">
          {data.map((post, key) => {
            return (
              <React.Fragment key={post.id}>
                {post.video ? (
                  <video controls width="auto">
                    <source src={post.video} />
                  </video>
                ) : (
                  ""
                )}
                {post?.user?.map((user, key) => (
                  <Post
                    key={post.id}
                    post={post}
                    userprofile={user}
                    video={post.video}
                  />
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
}
