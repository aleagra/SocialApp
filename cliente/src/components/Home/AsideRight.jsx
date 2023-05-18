import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Aside from "./Aside";
import Recomendations from "./Recomendations";

const AsideRight = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <section className="min-screen mt-[4rem] fixed right-[7rem]">
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
    </>
  );
};

export default AsideRight;
