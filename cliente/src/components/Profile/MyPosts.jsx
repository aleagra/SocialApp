import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Post from "../Post/Post";
import { ImgIcon } from "../../utilities";

function MyPosts() {
  const { posts } = useContext(AuthContext);

  return (
    <div
      className={`flex gap-y-12 pb-20 flex-col w-full justify-center items-center ${
        posts.length < 1
          ? " max-md:bg-transparent rounded-lg pb-0 max-md:pb-40"
          : ""
      }`}
    >
      {posts.length < 1 ? (
        <div className="h-[15rem] max-md:text-center flex flex-col items-center gap-y-[1rem] justify-center px-[2rem]">
          <ImgIcon />
          <h1 className="text-xl capitalize font-semibold dark:text-white">
            No posts available.
          </h1>
          <p className="text-lg dark:text-white opacity-40">
            When you make posts they will be shown here.
          </p>
        </div>
      ) : (
        posts.map((post, key) => (
          <React.Fragment key={post._id}>
            <Post
              key={`${post._id}-${post.user[0]._id}`}
              post={post}
              userprofile={post.user[0]}
            />
          </React.Fragment>
        ))
      )}
    </div>
  );
}

export default MyPosts;
