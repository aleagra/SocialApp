import React from "react";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Recomendations from "./Recomendations";
import { ReactSVG } from "react-svg";
const AsideRight = () => {
  const { user, userData } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followersUsers, setFollowersUsers] = useState([]);
  const modalFollow = useRef(null);
  const modalRef = useRef(null);
  const [hiddenButtons, setHiddenButtons] = useState([]);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        modalFollow.current &&
        !modalFollow.current.contains(event.target) &&
        !event.target.classList.contains("modal-content")
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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

  useEffect(() => {
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

    fetchFollowersUsers();
  }, [userData?.following]);

  const url = `http://localhost:5050/posts/user/${user}`;
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(url);
    setData(res.data.length);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleUnfollow = async (id) => {
    await axios.post(`http://localhost:5050/users/unfollow/${user}`, {
      follower: id,
    });
    setHiddenButtons((prevHiddenButtons) => [...prevHiddenButtons, id]);
  };
  return (
    <>
      <section className="min-screen w-[18%] mt-[4rem] fixed right-[7rem] max-xl:hidden">
        <div className="flex  h-fit justify-center rounded-lg bg-white p-3 shadow-lg dark:text-white dark:bg-[#0a0a13]">
          <div className="flex flex-col">
            <div className="relative flex justify-center">
              <ReactSVG
                src={`data:image/svg+xml;base64,${btoa(userData?.avatarImage)}`}
                style={{ width: "100%", height: "auto" }}
                className="color-item p-2  rounded-full"
              />
            </div>
            <h1 className="text-center text-2xl my-2 mt-6 font-bold capitalize">
              {userData?.username}
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
                <h1 className="text-lg font-bold">
                  {userData?.following.length}
                </h1>
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
        <div className="fixed inset-0 flex items-center z-10">
          <div
            ref={modalFollow}
            className={`bg-white dark:bg-[#0a0a13] absolute right-28 top-16 py-6 rounded-lg shadow-sm modal-content z-20 w-[18%] max-xl:hidden h-[25rem] transition-opacity  duration-300 ease-out`}
          >
            <div className="w-full relative py-4 flex justify-center border-b-2">
              <p className="text-center dark:text-white">Seguidores</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer absolute left-10 dark:stroke-white"
                onClick={closeModal}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            {followingUsers.map((element, key) => (
              <a href={"/Profile/" + element._id}>
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
          </div>
          <div className="fixed inset-0 " onClick={closeModal}></div>
        </div>
      )}

      {isOpen2 && (
        <div className="fixed inset-0 flex items-center z-10">
          <div
            ref={modalRef}
            className={`bg-white dark:bg-[#0a0a13] absolute right-28 top-16 py-6 rounded-lg shadow-sm modal-content z-20 w-[18%] max-xl:hidden h-[25rem] transition-opacity  duration-300 ease-out`}
          >
            <div className="w-full relative py-4 flex justify-center border-b-2">
              <p className="text-center dark:text-white">Seguidores</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer absolute left-10 dark:stroke-white"
                onClick={closeModal2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            {followersUsers.map((element, key) => (
              <div
                className="flex justify-between py-6 px-6 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10 "
                key={element._id}
              >
                <a href={"/Profile/" + element._id}>
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
          <div className="fixed inset-0 " onClick={closeModal2}></div>
        </div>
      )}
    </>
  );
};

export default AsideRight;
