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
    <>
      <div className="mt-[4rem] max-md:mt-0">
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
