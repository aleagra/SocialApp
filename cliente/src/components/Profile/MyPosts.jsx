import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Post from "../Post/Post";
import { FetchData } from "../User";
function MyPosts() {
  const { user } = useContext(AuthContext);

  const data = FetchData(`http://localhost:5050/posts/user/${user}`);
  return (
    <div className="flex gap-y-12 pb-20 flex-col w-full justify-center items-center">
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
  );
}

export default MyPosts;
