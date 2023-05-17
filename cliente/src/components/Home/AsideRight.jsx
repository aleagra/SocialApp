import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AsideRight = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="flex  w-[25%] flex-col gap-y-5 pt-[2%] max-lg:w-[25%] max-sm:hidden">
        <div className="fixed flex w-[20%]  justify-center max-lg:w-[25%]">
          <div className="flex w-full flex-col rounded-lg bg-white p-3 shadow-lg dark:text-white dark:bg-[#16181C]">
            <div className="flex flex-col justify-center">
              <div className="relative flex justify-center">
                <img
                  src={`data:image/svg+xml;base64,${user.avatarImage}`}
                  className="bottom-0 w-[70%] p-2 rounded-lg"
                  alt=""
                />
              </div>
              <h1 className="text-center text-xl my-3 font-bold">
                {user.username}
              </h1>
              <h3 className="text-center text-xs font-extralight">
                @{user.username}
              </h3>
              <div className="my-3 flex w-[100%]">
                <div className="flex w-[33%] flex-col items-center">
                  {/* <h1 className="text-lg font-bold">{user.post.length}</h1> */}
                  <h3 className="text-xs font-extralight opacity-60">Post</h3>
                </div>
                <div className="flex w-[33%] flex-col items-center">
                  <h1 className="text-lg font-bold">{user.followers.length}</h1>

                  <button
                    type="button"
                    className="text-xs font-extralight opacity-60"
                  >
                    Followers
                  </button>
                </div>
                <div className="flex w-[33%] flex-col items-center">
                  <h1 className="text-lg font-bold">{user.following.length}</h1>
                  <button
                    type="button"
                    className="text-xs font-extralight opacity-60"
                  >
                    Following
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AsideRight;
