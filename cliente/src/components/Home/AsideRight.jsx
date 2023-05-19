import React from "react";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Recomendations from "./Recomendations";
import { CloseIcon } from "../../utilities";

const AsideRight = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const modalFollow = useRef(null);
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
  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        const userPromises = user.following.map(
          (userId) => axios.get(`http://localhost:5050/users/${userId}`) // Utiliza 'userId' en lugar de 'user._id'
        );

        const users = await Promise.all(userPromises);
        const followingUsersData = users.map((response) => response.data);
        setFollowingUsers(followingUsersData);
      } catch (error) {
        // Manejo de errores
        console.error(error);
      }
    };

    fetchFollowingUsers();
  }, [user.following]);

  return (
    <>
      <section className="min-screen mt-[4rem] fixed right-[7rem] max-2xl:hidden">
        <div className="flex h-fit rounded-lg bg-white p-3 shadow-lg dark:text-white dark:bg-[#0a0a13]">
          <div className="flex flex-col">
            <div className="relative flex justify-center">
              <img
                src={`data:image/svg+xml;base64,${user.avatarImage}`}
                className="bottom-0 w-[40%] p-2 rounded-lg"
                alt=""
              />
            </div>
            <h1 className="text-center text-2xl my-1 font-bold capitalize">
              {user.username}
            </h1>
            <h3 className="text-center text-md font-extralight">
              @{user.username}
            </h3>
            <div className="my-6 flex w-[100%]">
              <div className="flex w-[33%] flex-col items-center">
                <h3 className="text-lg font-extralight opacity-60">Post</h3>
              </div>
              <div className="flex w-[33%] flex-col items-center">
                <h1 className="text-lg font-bold">{user.followers.length}</h1>

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
                <h1 className="text-lg font-bold">{user.following.length}</h1>
                <button
                  type="button"
                  className="text-lg font-extralight opacity-60"
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
            className={`bg-white absolute right-28 top-16 py-6 rounded-lg shadow-sm modal-content z-20 w-[21.5rem] h-[20rem] transition-opacity  duration-300 ease-out`}
          >
            <div className="w-full relative py-4 flex justify-center border-b-2">
              <p className="text-center">Seguidores</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer absolute left-10"
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
              <div
                className="flex justify-between pt-6 px-6 items-center max-xl:px-0 w-full  "
                key={element._id}
              >
                <div className="flex w-full items-center ">
                  <a
                    className="flex items-center justify-evenly w-full "
                    href={"/Profile/" + element._id}
                  >
                    <div className="w-full text-center flex items-center gap-4">
                      <img
                        alt=""
                        src={`data:image/svg+xml;base64,${element.avatarImage}`}
                        className="w-12 h-12"
                      />
                      <h3 className="dark:text-white/70 capitalize">
                        {element.username}
                      </h3>
                    </div>
                  </a>
                  <button className="color-item text-white rounded-xl p-2 px-4 text-sm ">
                    Unfollow
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="fixed inset-0 " onClick={closeModal}></div>
        </div>
      )}
    </>
  );
};

export default AsideRight;
