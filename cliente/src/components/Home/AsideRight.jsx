import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Recomendations from "./Recomendations";
import { ReactSVG } from "react-svg";
import { io as socketIOClient } from "socket.io-client";
import Modal from "./Modal";
import { FetchFollowersUsers, FetchFollowingUsers, FetchPost } from "../User";
const AsideRight = () => {
  const { user, userData, followingCount, setFollowingCount, posts } =
    useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followersUsers, setFollowersUsers] = useState([]);
  const [hiddenButtons, setHiddenButtons] = useState([]);
  const [post, setPost] = useState([]);
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

  FetchFollowingUsers(userData, setFollowingUsers);
  FetchFollowersUsers(userData, setFollowersUsers);
  FetchPost(
    `https://socialapp-backend-production-a743.up.railway.app/posts/user/${user}`,
    setPost
  );

  useEffect(() => {
    socket.current = socketIOClient(
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
      setHiddenButtons((prevHiddenButtons) => [...prevHiddenButtons, id]);
      setFollowingCount((prevCount) => prevCount - 1);

      await axios.post(
        `https://socialapp-backend-production-a743.up.railway.app/users/unfollow/${user}`,
        {
          follower: id,
        }
      );
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
      <section className="mt-[4rem] fixed flex justify-center flex-col w-[400px] pr-[4rem] max-xl:hidden">
        <div className="flex w-full justify-center rounded-lg bg-white shadow-lg dark:text-white dark:bg-[#0a0a13]">
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
                  <h1 className="font-bold">{posts.length}</h1>
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
        <div className="my-6">
          <Recomendations />
        </div>
      </section>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          title={"Followers"}
          closeModal={closeModal}
          style={`bg-white dark:bg-[#0a0a13] absolute overflow-y-scroll right-16 top-16 py-6 rounded-lg shadow-sm modal-content z-20 w-[336px] max-xl:hidden h-[438px] transition-opacity duration-300 ease-out `}
          content={followersUsers.map((element, key) => (
            <a href={"/" + element._id}>
              <div
                className="flex  py-6 px-6 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10 "
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
          style={`bg-white dark:bg-[#0a0a13] absolute overflow-y-scroll right-16 top-16 py-6 rounded-lg shadow-sm modal-content z-20 w-[336px] max-xl:hidden h-[438px] transition-opacity duration-300 ease-out`}
          content={
            <div>
              {followingUsers.map((element, key) => (
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
