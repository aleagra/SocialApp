import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Post from "../Post/Post";
import axios from "axios";
function MyPosts() {
  const { user } = useContext(AuthContext);

  const url = `http://localhost:5050/posts/user/${user}`;
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
    <div className="flex gap-y-12 pb-20 flex-col w-full justify-center m-auto items-center">
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
