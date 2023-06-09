import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Post from "../Post/Post";

function MyPosts() {
  const { posts } = useContext(AuthContext);

  return (
    <div className="flex gap-y-12 pb-20 flex-col w-full justify-center items-center">
      {posts.map((post, key) => (
        <React.Fragment key={post._id}>
          <Post
            key={`${post._id}-${post.user[0]._id}`}
            post={post}
            userprofile={post.user[0]}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export default MyPosts;
