import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Aside, Recomendations } from "../components/Home";
import MyPosts from "../components/Profile/MyPosts";
import { ReactSVG } from "react-svg";
import Modal from "../components/Home/Modal";
import { CloseIcon } from "../utilities";
import { Link } from "react-router-dom";
import NavResponsive from "../components/Navbar/NavResponsive";
import { io } from "socket.io-client";
import Wrapper from "../wrapper/wrapper";
import {
  FetchFollowersUsers,
  FetchFollowingUsers,
  FetchPost,
} from "../components/User";

function Profile() {
  const { user, userData, setFollowingCount, posts } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [followersUsers, setFollowersUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [hiddenButtons, setHiddenButtons] = useState([]);

  const socket = useRef(null);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal2 = () => {
    setIsOpen2(true);
  };

  const closeModal2 = () => {
    setIsOpen2(false);
  };
  const updateMyData = (newData) => {
    console.log("Datos actualizados:", newData);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const resp = await axios.put(
      `https://socialapp-backend-production-a743.up.railway.app/users/${userData._id}`,
      {
        fullName: fullName,
      }
    );
    const newData = {
      ...userData,
      fullName: fullName,
    };
    updateMyData(newData);
    console.log(resp.data);
    const response = await axios.put(
      `https://socialapp-backend-production-a743.up.railway.app/posts/profilename/${userData._id}`,
      {
        fullName: fullName,
      }
    );
    window.location.reload();
  };

  FetchFollowersUsers(userData, setFollowersUsers);
  FetchFollowingUsers(userData, setFollowingUsers);

  const [showModal, setShowModal] = useState(false);

  const openModa = () => {
    setShowModal(true);
  };

  const closeModa = () => {
    setShowModal(false);
  };

  useEffect(() => {
    socket.current = io(
      "https://socialapp-backend-production-a743.up.railway.app"
    );
    socket.current.emit("add-user", user);

    socket.current.on("follower-count-updated", ({ userId, followerCount }) => {
      if (userId === user) {
        setFollowingCount(followerCount);
      }
    });
    return () => {
      socket.current.disconnect();
    };
  }, [user]);
  const handleUnfollow = async (id) => {
    try {
      await axios.post(
        `https://socialapp-backend-production-a743.up.railway.app/users/unfollow/${user}`,
        {
          follower: id,
        }
      );
      setHiddenButtons((prevHiddenButtons) => [...prevHiddenButtons, id]);
      setFollowingCount((prevCount) => prevCount - 1);
      socket.current.emit("unfollow-user", {
        userId: user,
        followerId: id,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="w-[300px] fixed z-30">
        <Aside />
        <NavResponsive />
      </div>
      <div className="w-full col-start-2 max-xl:col-start-1 max-xl:pr-[4rem] max-md:pr-0">
        <div className="relative w-full justify-center max-md:px-0 items-center min-h-screen h-screen">
          <div className="flex flex-col dark:bg-[#131324] h-full dark:text-white max-xl:m-0">
            <div className="relative mb-[4rem] xl:pt-[4rem] max-xl:pt-0 flex flex-col">
              <div className="flex flex-col relative bg-white dark:bg-[#0a0a13] rounded-lg shadow-md">
                <div className="w-full flex-col h-fit py-12 max-md:py-8 justify-center relavite flex items-center gap-5 max-md:gap-0">
                  <div className="flex items-center gap-20 max-2xl:gap-12 max-md:gap-4 max-md:flex-col">
                    <ReactSVG
                      src={`data:image/svg+xml;base64,${btoa(
                        userData?.avatarImage
                      )}`}
                      className="color-item rounded-full w-[8rem] h-auto"
                    />
                    <div className="flex flex-col gap-y-6">
                      <div className="flex  text-xl items-center gap-6 max-md:justify-center">
                        <h1 className="font-bold capitalize max-w-[220px] whitespace-nowrap">
                          {userData?.fullName}
                        </h1>
                        <div
                          className="color-item rounded-lg flex p-1 px-4 h-fit cursor-pointer max-md:hidden"
                          onClick={openModa}
                        >
                          <p className="whitespace-nowrap text-white">
                            Edit profile
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-10 max-md:px-12 max-2xl:gap-5">
                        <div className="flex text-center text-xl gap-2">
                          <span className="font-bold max-md:text-sm">
                            {posts.length}{" "}
                            <span className="text-black/20 dark:text-white/30">
                              Posts
                            </span>
                          </span>
                        </div>
                        <div
                          className="flex text-center cursor-pointer text-xl gap-2 flex-col"
                          onClick={openModal2}
                        >
                          <span className="font-bold max-md:text-sm">
                            {userData?.followers.length}{" "}
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
                            {userData?.following.length}{" "}
                            <span className="text-black/20 dark:text-white/30">
                              Followings
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div
                      className="color-item rounded-lg flex p-2 px-4 h-fit cursor-pointer mt-8 md:hidden"
                      onClick={openModa}
                    >
                      <p>Edit profile</p>
                    </div>
                    <div
                      className="color-item rounded-lg flex p-2 px-4 h-fit cursor-pointer mt-8 md:hidden"
                      onClick={openModa}
                    >
                      <p>Logout</p>
                    </div>
                  </div>
                </div>
              </div>

              {isOpen && (
                <Modal
                  title={"Following"}
                  isOpen={isOpen}
                  closeModal={closeModal}
                  bg={"bg-black/60"}
                  style={`bg-white overflow-y-scroll  dark:bg-[#0a0a13] absolute right-[36%] max-2xl:right-[25%] top-[16rem] max-2xl:top-[8rem] border border-gray-100 dark:border-white/10 pb-6 rounded-lg shadow-sm modal-content z-20 w-[25%] h-[25rem] transition-opacity duration-300 ease-out max-md:w-[90%] max-md:left-[5%] max-md:top-[27%] max-xl:w-[50%] max-md:h-[50%]`}
                  content={
                    <div>
                      {" "}
                      {followingUsers.map((element, key) => (
                        <div className="flex w-full px-3 items-center justify-between dark:hover:bg-white/20 hover:bg-black/10 ">
                          <a href={"/" + element._id}>
                            <div
                              className="flex py-6 px-6 pl-10 items-center w-full justify-between"
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
                          {!hiddenButtons.includes(element._id) && (
                            <button
                              className="color-item h-fit text-white rounded-xl p-2 px-4 text-sm z-30"
                              id={element._id}
                              onClick={() => handleUnfollow(element._id)}
                            >
                              Unfollow
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  }
                />
              )}
              {isOpen2 && (
                <Modal
                  isOpen={isOpen2}
                  title={"Followers"}
                  closeModal={closeModal2}
                  bg={"bg-black/60"}
                  style={`bg-white overflow-y-scroll  dark:bg-[#0a0a13] absolute right-[36%] max-2xl:right-[25%] top-[16rem] max-2xl:top-[8rem] border border-gray-100 dark:border-white/10 pb-6 rounded-lg shadow-sm modal-content z-20 w-[25%] h-[25rem] transition-opacity duration-300 ease-out max-md:w-[90%] max-md:left-[5%] max-md:top-[27%] max-xl:w-[50%] max-md:h-[50%]`}
                  content={
                    <div>
                      {" "}
                      {followersUsers.map((element, key) => (
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
            </div>
            <MyPosts />
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed top-0 left-[2rem] max-xl:left-0 w-screen max-xl:px-8 h-screen bg-black bg-opacity-50 flex justify-center ">
          <div className="bg-white dark:bg-[#0a0a13] h-[26rem] max-xl:w-full dark:text-white mt-20 w-[25%] rounded-lg relative py-6">
            <div
              className="absolute left-10 top-8 cursor-pointer"
              onClick={closeModa}
            >
              <CloseIcon />
            </div>
            <h1 className=" text-xl capitalize text-center border-b-2 py-2">
              edit profile
            </h1>
            <div className="flex flex-col pt-12 justify-center gap-y-6 px-16 max-xl:px-0 max-2xl:items-center">
              <div className="flex items-center gap-6 max-xl:justify-center">
                <ReactSVG
                  src={`data:image/svg+xml;base64,${btoa(
                    userData?.avatarImage
                  )}`}
                  className="color-item  rounded-full w-[4rem] h-[4rem]"
                />
                <div className="flex  text-md flex-col text-lg">
                  <span className="font-semibold">@{userData?.username}</span>
                  <Link to="/setAvatar" className="cursor-pointer text">
                    Change avatar
                  </Link>
                </div>
              </div>
              <form action="" onSubmit={handleClick}>
                <div className="flex gap-6 items-center py-8 max-xl:flex-col max-xl:py-2">
                  <p className="font-bold">Name:</p>
                  <input
                    type="text"
                    className="border rounded-md px-5 text-center py-1 dark:bg-transparent boder"
                    placeholder={userData?.fullName}
                    maxLength="20"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-center w-full h-fit py-5">
                  <button
                    className="p-2 color-item rounded-md w-fit h-fit whitespace-nowrap"
                    type="submit"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="col-start-3 mr-[4rem] max-2xl:pr-0 pt-[4rem] max-xl:pt-0 max-xl:col-start-2 max-md:hidden ">
        <Recomendations />
      </div>
    </>
  );
}
export default Wrapper(
  Profile,
  "relative h-screen grid grid-cols-[300px,1fr,400px] gap-[4rem] max-xl:gap-[2rem]  max-2xl:grid-cols-[300px,1fr] max-xl:grid-cols-[1fr]"
);
