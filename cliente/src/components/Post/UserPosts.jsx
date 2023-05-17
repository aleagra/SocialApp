import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Post from "./Post";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";

import axios from "axios";

const userPosts = () => {
  // const url2 = `http://localhost:5050/posts`;
  // const [posts, setPosts] = useState([]);
  // const [following, setFollowing] = useState([]);
  // const PF = import.meta.env.VITE_PUBLIC_FOLDER;

  // useEffect(() => {
  //   async function userPosts() {
  //     const userResponse = await axios.get("http://localhost:5050/auth/user");
  //     const userId = userResponse.data._id;

  //     const followingResponse = await axios.get(
  //       `http://localhost:5050/users/followers/${userId}`
  //     );
  //     const followingUsers = followingResponse.data.map((user) => user._id);

  //     const postsResponse = await axios.get(url2);
  //     const filteredPosts = postsResponse.data.filter((post) =>
  //       followingUsers.includes(post.userId)
  //     );

  //     setPosts(filteredPosts);
  //   }

  //   userPosts();
  // }, []);

  return (
    <div>
      {/* {posts.map((post) => {
        return (
          <div
            key={post.id}
            className="max-ms:px-0 flex h-[50%]  w-[55%] flex-col gap-y-8 py-[2%] px-[2%] max-lg:w-[70%] max-md:pl-0 max-sm:w-[95%] items-center"
          >
            <div className="max-ms:px-0 flex h-[50%]  w-[85%] flex-col gap-y-8 py-[2%] px-[2%] max-lg:w-[70%] max-md:pl-0 max-sm:w-[95%]">
              <div className="flex w-[100%] flex-col  rounded-lg bg-white p-[2%] shadow-lg dark:bg-[#16181C] dark:text-white max-lg:p-0">
                <div className="flex h-16 w-full p-2">
                  <div className="relative  flex w-full cursor-pointer items-center gap-4">
                    <div className="flex flex-col ">
                      <h4 className="text-xs font-extralight opacity-70">
                        {format(post.createdAt)}
                      </h4>
                    </div>
                  </div>
                </div>
                <p className="px-[3%] py-[1%] text-lg font-light max-lg:text-base">
                  {post.desc}
                </p>
                <div className="w-full max-h-[400px] flex justify-center ">
                  <img className=" " src={PF + post.img} alt="" />
                </div>
              </div>
            </div>
          </div>
        );
      })} */}
    </div>
  );
};

export default userPosts;
