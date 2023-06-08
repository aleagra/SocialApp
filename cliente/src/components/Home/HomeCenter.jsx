import React from "react";
import { useContext } from "react";
import Post from "../Post/Post";
import UserPost from "../Post/UserPost";
import { AuthContext } from "../../context/AuthContext";
import { FetchData } from "../User";

export function HomeCenter() {
  const { user } = useContext(AuthContext);
  const data = FetchData(`http://localhost:5050/posts/friends/${user}`);
  return (
    <>
      <div className="my-[4rem] max-md:mb-28 max-md:mt-0">
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
