import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Aside, Modal, Recomendations } from "../Home";
import { io } from "socket.io-client";
import Post from "./Post";
import { ReactSVG } from "react-svg";
import { AuthContext } from "../../context/AuthContext";
import { NavResponsive } from "../Navbar";
import Wrapper from "../../wrapper/wrapper";
function ProfileUsers() {
  const { user, userData, followingCount, setFollowingCount } =
    useContext(AuthContext);
  const socket = useRef(null);
  const [data, setData] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  let { id } = useParams();
  const posts = `http://localhost:5050/posts/user/${id}`;
  const url = `http://localhost:5050/users/${id}`;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [followersUsers, setFollowersUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
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
        followers: followers,
        following: following,
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
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal1 = () => {
    setIsOpen2(true);
  };

  const closeModal1 = () => {
    setIsOpen2(false);
  };

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        const userPromises = profile.followers.map((userId) =>
          axios.get(`http://localhost:5050/users/${userId}`)
        );

        const users = await Promise.all(userPromises);
        const followingUsersData = users.map((response) => response.data);
        setFollowersUsers(followingUsersData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowingUsers();
  }, [profile.followers]);
  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        const userPromises = profile.following.map((userId) =>
          axios.get(`http://localhost:5050/users/${userId}`)
        );
        const users = await Promise.all(userPromises);
        const followingUsersData = users.map((response) => response.data);
        setFollowingUsers(followingUsersData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFollowingUsers();
  }, [profile.following]);
  return (
    <>
      <div className="w-[300px] fixed z-30">
        <Aside />
        <NavResponsive />
      </div>

      <div className="relative w-full justify-center items-center min-h-screen h-screen xl:col-start-2 max-2xl:pr-[4rem] max-xl:pr-0">
        <div className="flex flex-col dark:bg-[#131324] h-full dark:text-white max-xl:m-0 max-lg:overflow-hidden">
          <div className="relative mb-[4rem] max-xl:pt-0 pt-[4rem] flex flex-col">
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
                    <div className="flex  text-xl items-center gap-6 max-md:flex-col">
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
                      <div
                        className="flex text-center text-xl gap-2 flex-col cursor-pointer"
                        onClick={openModal1}
                      >
                        <span className="font-bold max-md:text-sm">
                          {profile.followers?.length}{" "}
                          <span className="text-black/20 dark:text-white/30">
                            Followers
                          </span>
                        </span>
                      </div>
                      <div
                        className="flex cursor-pointer text-center text-xl gap-2 flex-col"
                        onClick={openModal}
                      >
                        <span className="font-bold max-md:text-sm">
                          {profile.following?.length}{" "}
                          <span className="text-black/20 dark:text-white/30">
                            Followings
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
        {isOpen && (
          <Modal
            title={"Following"}
            isOpen={isOpen}
            closeModal={closeModal}
            bg={"bg-black/60"}
            style={`bg-white overflow-y-scroll dark:bg-[#0a0a13] absolute right-[36%] max-2xl:right-[25%] top-[16rem] max-2xl:top-[8rem] border border-gray-100 dark:border-white/10 pb-6 rounded-lg shadow-sm modal-content z-20 w-[25%] h-[25rem] transition-opacity duration-300 ease-out max-md:w-[70%] max-md:left-[15%] max-md:top-[27%] max-xl:w-[50%] max-md:h-[50%]`}
            content={
              <div>
                {" "}
                {followingUsers.map((element, key) => (
                  <a href={"/" + element._id}>
                    <div
                      className="flex py-6 px-6 pl-10 items-center w-full dark:hover:bg-white/20 hover:bg-black/10"
                      key={element._id}
                    >
                      <div className="text-center flex items-center gap-4">
                        <ReactSVG
                          src={`data:image/svg+xml;base64,${btoa(
                            element.avatarImage
                          )}`}
                          className="color-item rounded-full w-16 h-16"
                        />

                        <h3 className="text capitalize font-bold text-xl">
                          {element.username}
                        </h3>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            }
          />
        )}
        {isOpen2 && (
          <Modal
            isOpen={isOpen2}
            title={"Followers"}
            closeModal={closeModal1}
            bg={"bg-black/60"}
            style={`bg-white overflow-y-scroll  dark:bg-[#0a0a13] absolute right-[36%] max-2xl:right-[25%] top-[16rem] max-2xl:top-[8rem] border border-gray-100 dark:border-white/10 pb-6 rounded-lg shadow-sm modal-content z-20 w-[25%] h-[25rem] transition-opacity duration-300 ease-out max-md:w-[90%] max-md:left-[5%] max-md:top-[27%] max-xl:w-[50%] max-md:h-[50%]`}
            content={
              <div>
                {" "}
                {followersUsers.map((element, key) => (
                  <a href={"/" + element._id}>
                    <div
                      className="flex py-6 px-6 pl-10 items-center  w-full dark:hover:bg-white/20 hover:bg-black/10"
                      key={element._id}
                    >
                      <div className="text-center flex items-center gap-4">
                        <ReactSVG
                          src={`data:image/svg+xml;base64,${btoa(
                            element.avatarImage
                          )}`}
                          className="color-item rounded-full w-16 h-16"
                        />

                        <h3 className="text capitalize font-bold text-xl">
                          {element.username}
                        </h3>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            }
          />
        )}
      </div>
      <div className="pr-[4rem] pt-[4rem] max-2xl:hidden">
        <Recomendations />
      </div>
    </>
  );
}

export default Wrapper(
  ProfileUsers,
  "relative h-screen grid grid-cols-[300px,1fr,400px] gap-[4rem] max-xl:gap-[2rem]  max-2xl:grid-cols-[300px,1fr] max-xl:grid-cols-[1fr]"
);
