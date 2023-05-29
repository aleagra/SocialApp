import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Recomendations from "./Recomendations";
import { ReactSVG } from "react-svg";
import { io } from "socket.io-client";
import Modal from "./Modal";
const AsideRight = () => {
  const {
    user,
    userData,
    followingCount,
    followedUserData,
    setFollowingCount,
  } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followersUsers, setFollowersUsers] = useState([]);
  const modalFollow = useRef(null);
  const modalRef = useRef(null);
  const [hiddenButtons, setHiddenButtons] = useState([]);
  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (
  //       modalFollow.current &&
  //       !modalFollow.current.contains(event.target) &&
  //       !event.target.classList.contains("modal-content")
  //     ) {
  //       closeModal();
  //     }
  //   };

  //   document.addEventListener("mousedown", handleOutsideClick);

  //   return () => {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal2 = () => {
    setIsOpen2(true);
    fetchFollowersUsers();
  };

  const closeModal2 = () => {
    setIsOpen2(false);
  };
  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        if (Array.isArray(userData?.followers)) {
          const userPromises = userData.followers.map((userId) =>
            axios.get(`http://localhost:5050/users/${userId}`)
          );

          const users = await Promise.all(userPromises);
          const followingUsersData = users.map((response) => response.data);
          setFollowingUsers(followingUsersData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowingUsers();
  }, [userData?.followers]);

  const fetchFollowersUsers = async () => {
    try {
      if (Array.isArray(userData?.following)) {
        const userPromises = userData.following.map((userId) =>
          axios.get(`http://localhost:5050/users/${userId}`)
        );

        const users = await Promise.all(userPromises);
        const followingUsersData = users.map((response) => response.data);
        setFollowersUsers(followingUsersData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const url = `http://localhost:5050/posts/user/${user}`;
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(url);
    setData(res.data.length);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const socket = useRef(null);
  useEffect(() => {
    socket.current = io("http://localhost:5050");
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
      // Realizar la petición para dejar de seguir a la persona
      await axios.post(`http://localhost:5050/users/unfollow/${user}`, {
        follower: id,
      });

      // Actualizar el estado y ocultar los botones correspondientes
      setHiddenButtons((prevHiddenButtons) => [...prevHiddenButtons, id]);

      // Restar 1 al número de seguidores
      setFollowingCount((prevCount) => prevCount - 1);

      // Volver a cargar la lista de seguidores
      fetchFollowersUsers();

      // Emitir el evento "unfollow-user" al servidor de sockets
      socket.current.emit("unfollow-user", {
        userId: user,
        followerId: id,
      });

      // Realizar cualquier otra actualización necesaria
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <section className="min-screen w-[18%] mt-[4rem] fixed right-[7rem] max-xl:hidden ">
        <div className="flex  h-fit justify-center rounded-lg bg-white  shadow-lg dark:text-white dark:bg-[#0a0a13]">
          <div className="flex flex-col pt-6">
            <div className="relative flex justify-center">
              <ReactSVG
                src={`data:image/svg+xml;base64,${btoa(userData?.avatarImage)}`}
                style={{ width: "100%", height: "auto" }}
                className="color-item p-2  rounded-full"
              />
            </div>
            <h1 className="text-center text-2xl my-2 mt-6 font-bold capitalize">
              {userData?.fullName}
            </h1>
            <h3 className="text-center text-md font-extralight">
              @{userData?.username}
            </h3>
            <div className="my-6 gap-4 flex w-[100%]">
              <div className="flex w-[33%] flex-col items-center">
                <Link to="/Profile" className="text-center text-lg">
                  <h1 className="font-bold">{data}</h1>
                  <h3 className="font-extralight opacity-60">Post</h3>
                </Link>
              </div>
              <div className="flex w-[33%] flex-col items-center">
                <h1 className="text-lg font-bold">
                  {userData?.followers.length}
                </h1>

                <button
                  type="button"
                  className="text-lg font-extralight opacity-60"
                  onClick={(e) => {
                    openModal();
                  }}
                >
                  Followers
                </button>
              </div>
              <div className="flex w-[33%] flex-col items-center">
                <h1 className="text-lg font-bold">{followingCount}</h1>
                <button
                  type="button"
                  className="text-lg font-extralight opacity-60"
                  onClick={(e) => {
                    openModal2();
                  }}
                >
                  Following
                </button>
              </div>
            </div>
          </div>
        </div>
        <Recomendations />
      </section>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          title={"Followers"}
          closeModal={closeModal}
          style={`bg-white dark:bg-[#0a0a13] absolute overflow-y-scroll right-28 top-16 py-6 rounded-lg shadow-sm modal-content z-20 w-[18%] max-xl:hidden h-[25rem] transition-opacity duration-300 ease-out `}
          content={followingUsers.map((element, key) => (
            <a href={"/" + element._id}>
              <div
                className="flex  py-6 px-6 pl-10 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10 "
                key={element._id}
              >
                <div className=" text-center flex items-center gap-4">
                  <ReactSVG
                    src={`data:image/svg+xml;base64,${btoa(
                      element.avatarImage
                    )}`}
                    className="color-item  rounded-full w-16 h-16"
                  />
                  <h3 className="text capitalize font-bold text-xl">
                    {element.username}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        />
      )}
      {isOpen2 && (
        <Modal
          isOpen={isOpen2}
          title={"Followig"}
          closeModal={closeModal2}
          style={`bg-white dark:bg-[#0a0a13] overflow-y-scroll absolute right-28 top-16  rounded-lg shadow-sm modal-content z-20 w-[18%] max-xl:hidden h-[25rem] transition-opacity duration-300 ease-out`}
          content={
            <div>
              {followersUsers.map((element, key) => (
                <div
                  className="flex justify-between py-6 px-6 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10 "
                  key={element._id}
                >
                  <a href={"/" + element._id}>
                    <div className="text-center flex items-center gap-6">
                      <ReactSVG
                        src={`data:image/svg+xml;base64,${btoa(
                          element.avatarImage
                        )}`}
                        className="color-item  rounded-full w-16 h-16"
                      />
                      <h3 className="text font-bold capitalize">
                        {element.username}
                      </h3>
                    </div>
                  </a>
                  {!hiddenButtons.includes(element._id) && (
                    <button
                      className="color-item text-white rounded-xl p-2 px-4 text-sm z-30"
                      id={element._id}
                      onClick={() => handleUnfollow(element._id)}
                    >
                      Unfollow
                    </button>
                  )}
                </div>
              ))}{" "}
              {followedUserData.map((element, key) => (
                <div
                  className="flex justify-between py-6 px-6 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10 "
                  key={element._id}
                >
                  <a href={"/" + element._id}>
                    <div className="text-center flex items-center gap-6">
                      <ReactSVG
                        src={`data:image/svg+xml;base64,${btoa(
                          element.avatarImage
                        )}`}
                        className="color-item  rounded-full w-16 h-16"
                      />
                      <h3 className="text font-bold capitalize">
                        {element.username}
                      </h3>
                    </div>
                  </a>
                  {!hiddenButtons.includes(element._id) && (
                    <button
                      className="color-item text-white rounded-xl p-2 px-4 text-sm z-30"
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
    </>
  );
};

export default AsideRight;
