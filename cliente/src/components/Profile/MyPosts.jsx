import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Post from "../Post/Post";
import { FetchData } from "../User";

function MyPosts() {
  const { user } = useContext(AuthContext);
  const data = FetchData(
    `https://socialapp-backend-production-a743.up.railway.app/posts/user/${user}`
  );

  return (
    <div className="flex gap-y-12 pb-20 flex-col w-full justify-center items-center">
      {data.map((post) => {
        return (
          <React.Fragment key={post.id}>
            <div key={post.id}>
              {post.video && (
                <video controls width="auto" key={post.id}>
                  <source src={post.video} />
                </video>
              )}
            </div>

            {post?.user?.map((user) => {
              return (
                <React.Fragment key={user.id}>
                  <Post
                    key={user.id}
                    post={post}
                    userprofile={user}
                    video={post.video}
                  />
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default MyPosts;
