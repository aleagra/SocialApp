import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { Aside } from "../Home";
import Post from "./Post";
import { ReactSVG } from "react-svg";
import { AuthContext } from "../../context/AuthContext";
import { NavResponsive } from "../Navbar";
function ProfileUsers() {
  const { user, followingCount, setFollowingCount } = useContext(AuthContext);
  const socket = useRef(null);
  const [data, setData] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  let { id } = useParams();
  const posts = `http://localhost:5050/posts/user/${id}`;
  const url = `http://localhost:5050/users/${id}`;
  const [profile, setProfile] = useState({
    currentUserImage: undefined,
    currentUserName: undefined,
    description: undefined,
    followers: undefined,
    following: undefined,
    background: undefined,
  });
  const urlPost = `http://localhost:5050/posts/user/${id}`;
  const [post, setPost] = useState([]);
  useEffect(() => {
    async function fetchUser() {
      const { data } = await axios.get(url);
      const {
        username,
        descripcion,
        background,
        avatarImage,
        followers,
        following,
      } = data;
      setProfile({
        ...data,
        currentUserImage: avatarImage,
        currentUserName: username,
        description: descripcion,
        background: background,
        followers: followers.length,
        following: following.length,
      });
    }
    fetchUser();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(posts);
    setData(
      res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
    );
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchPost = async () => {
    const res = await axios.get(urlPost);
    setPost(res.data.length);
  };
  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    socket.current = io("http://localhost:5050");
    socket.current.emit("add-user", user);

    socket.current.on("follower-count-updated", ({ userId, followerCount }) => {
      if (userId === user) {
        setFollowingCount(followerCount);
      }
    });

    const checkFollowingStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/users/not-following/${user}`
        );
        const notFollowingList = response.data; // Lista de personas que no sigues

        // Verificar si el _id de la persona de interés está en la lista de no seguidos
        const isCurrentlyFollowing = !notFollowingList.some(
          (person) => person._id === id
        );
        setIsFollowing(isCurrentlyFollowing);
      } catch (error) {
        console.error(error);
      }
    };

    checkFollowingStatus();

    return () => {
      socket.current.disconnect();
    };
  }, [user, id]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.post(`http://localhost:5050/users/unfollow/${user}`, {
          follower: id,
        });
      } else {
        await axios.post(`http://localhost:5050/users/follow/${user}`, {
          follower: id,
        });
      }

      socket.current.emit("follow-user", {
        userId: user,
        followerId: id,
      });

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(`http://localhost:5050/users/unfollow/${user}`, {
        follower: id,
      });
      setFollowingCount((prevCount) => prevCount - 1);
      socket.current.emit("unfollow-user", {
        userId: user,
        followerId: id,
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="flex w-full">
      <div className="fixed z-20">
        <Aside />
        <NavResponsive />
      </div>
      <div className="relative w-full justify-center items-center min-h-screen h-screen ">
        <div className="flex flex-col dark:bg-[#131324] h-full dark:text-white ml-[35%] mr-[15%] max-xl:m-0 max-lg:overflow-hidden">
          <div className="relative mb-[4rem] max-xl:pt-0 pt-20 flex flex-col">
            <div className="flex flex-col  relative bg-white dark:bg-[#0a0a13] rounded-lg shadow-md">
              <div className="w-full flex-col h-fit py-12 max-md:py-8 justify-center relavite flex items-center gap-5 max-md:gap-0">
                <div className="flex items-center gap-20 max-md:gap-4 max-md:flex-col">
                  <ReactSVG
                    src={`data:image/svg+xml;base64,${btoa(
                      profile.avatarImage
                    )}`}
                    className="color-item rounded-full w-[8rem] h-auto"
                  />
                  <div className="flex flex-col gap-y-6 ">
                    <div className="flex  text-xl justify-center  items-center gap-6 max-md:flex-col">
                      <h1 className="font-bold capitalize max-w-[220px] whitespace-nowrap">
                        {profile.fullName}
                      </h1>
                      <div
                        className="color-item rounded-lg flex p-1 px-4 h-fit cursor-pointer"
                        onClick={() => {
                          isFollowing ? handleUnfollow(id) : handleFollow(id);
                        }}
                      >
                        <p className="whitespace-nowrap text-white">
                          {isFollowing ? "Unfollow" : "Follow"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-10 max-md:px-12">
                      <div className="flex text-center text-xl gap-2">
                        <span className="font-bold max-md:text-sm">
                          {post}{" "}
                          <span className="text-black/20 dark:text-white/30">
                            Posts
                          </span>
                        </span>
                      </div>
                      <div className="flex text-center cursor-pointer text-xl gap-2 flex-col">
                        <span className="font-bold max-md:text-sm">
                          {profile.followers}{" "}
                          <span className="text-black/20 dark:text-white/30">
                            Followers
                          </span>
                        </span>
                      </div>
                      <div className="flex cursor-pointer text-center text-xl gap-2 flex-col">
                        <span className="font-bold max-md:text-sm">
                          {profile.following}{" "}
                          <span className="text-black/20 dark:text-white/30">
                            Followings
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="flex gap-6">
                  <div className="color-item rounded-lg flex p-2 px-4 h-fit cursor-pointer mt-8 md:hidden">
                    <p>Edit profile</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="flex gap-y-12 pb-20 flex-col w-full justify-center  items-center">
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
        </div>
      </div>
    </section>
  );
}

export default ProfileUsers;
