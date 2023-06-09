import React from "react";
import { useContext } from "react";
import Post from "../Post/Post";
import UserPost from "../Post/UserPost";
import { AuthContext } from "../../context/AuthContext";

export function HomeCenter() {
  const { postsFriends } = useContext(AuthContext);
  return (
    <>
      <div className="my-[4rem] max-md:mb-28 max-md:mt-0">
        <UserPost />
        <div className="flex gap-y-12 flex-col w-full justify-center items-center">
          {postsFriends.map((post, key) => (
            <React.Fragment key={post._id}>
              <Post
                key={`${post._id}-${post.user[0]._id}`} // Utiliza una clave única para cada elemento <Post>
                post={post}
                userprofile={post.user[0]}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
