import React from "react";
import { useContext } from "react";
import Post from "../Post/Post";
import UserPost from "../Post/UserPost";
import { AuthContext } from "../../context/AuthContext";
import { ImgIcon } from "../../utilities";

export function HomeCenter() {
  const { postsFriends } = useContext(AuthContext);
  return (
    <>
      <div className="my-[4rem] max-md:mb-28 max-md:mt-0">
        <UserPost />
        <div
          className={`flex gap-y-12 flex-col w-full justify-center items-center ${
            postsFriends < 1 ? " rounded-lg pb-0 max-md:pb-40" : ""
          } `}
        >
          {postsFriends.length < 1 ? (
            <div className="h-[15rem] w-full max-md:text-center flex flex-col items-center gap-y-[2rem] justify-center px-[2rem] md:rounded-lg">
              <ImgIcon />
              <h1 className="text-xl capitalize font-semibold dark:text-white">
                No posts to show.
              </h1>
              <p className="text-lg dark:text-white opacity-40">
                This will show the publications of the people you follow.
              </p>
            </div>
          ) : (
            postsFriends.map((post, key) => (
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
      </div>
    </>
  );
}
