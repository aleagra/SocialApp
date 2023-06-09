import React from "react";
import { useContext } from "react";
import Post from "../Post/Post";
import UserPost from "../Post/UserPost";
import { AuthContext } from "../../context/AuthContext";
import { FetchData } from "../User";

export function HomeCenter() {
  const { user } = useContext(AuthContext);
  const data = FetchData(
    `https://socialapp-backend-production-a743.up.railway.app/posts/friends/${user}`
  );
  return (
    <>
      <div className="my-[4rem] max-md:mb-28 max-md:mt-0">
        <UserPost />
        <div className="flex gap-y-12 flex-col w-full justify-center items-center">
          {data.map((post) => (
            <React.Fragment key={post.id}>
              {post.video ? (
                <video controls width="auto">
                  <source src={post.video} />
                </video>
              ) : (
                ""
              )}
              {post?.user?.map((user) => (
                <Post
                  key={`${post.id}-${user.id}`} // Utiliza una clave única para cada elemento <Post>
                  post={post}
                  userprofile={user}
                  video={post.video}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
