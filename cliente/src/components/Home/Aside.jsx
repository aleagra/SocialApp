import React from "react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Aside = () => {
  const { user } = useContext(AuthContext);
  const [notFollowing, setNotFollowing] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/users/not-following/${user._id}`
        );
        setNotFollowing(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [user._id]);

  const handleFollow = async (id) => {
    try {
      await axios.post(`http://localhost:5050/users/follow/${user._id}`, {
        follower: id,
      });

      setNotFollowing((prevNotFollowing) =>
        prevNotFollowing.filter((user) => user._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-[25%] py-[2%] gap-y-10  justify-end  flex max-lg:hidden">
        <div className="flex fixed w-[20%] flex-col  rounded-lg p-3 shadow-lg bg-white dark:text-white dark:bg-[#16181C] max-xl:text-xs">
          <div className="w-full flex flex-col gap-y-1">
            <h4 className=" text-sm  mt-2 mb-2  text font-semibold text-center">
              RECOMMENDATION
            </h4>
            {notFollowing.map((Element) => {
              return (
                <>
                  <div
                    className="flex justify-between p-2 items-center max-xl:px-0"
                    key={Element._id}
                  >
                    <div className="flex w-full items-center ">
                      <a
                        className="flex items-center justify-evenly w-full "
                        href={"/Profile/" + Element._id}
                      >
                        <div className="w-full text-center flex items-center gap-4">
                          <img
                            alt=""
                            src={`data:image/svg+xml;base64,${Element.avatarImage}`}
                            className="w-12 h-10"
                          />
                          <h3 className=" font-extralight">
                            {Element.username}
                          </h3>
                        </div>
                      </a>
                    </div>
                    <button
                      className="color-item rounded-lg p-2 text-md font-light"
                      id={Element._id}
                      onClick={() => handleFollow(Element._id)}
                    >
                      Follow
                    </button>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Aside;
