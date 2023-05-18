import React from "react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
function Recomendations() {
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
    <section className=" py-6 px-8 my-6 rounded-md shadow-lg bg-white dark:text-white dark:bg-[#0a0a13]">
      <p className="font-semibold">RECOMMENDATION</p>
      <div className="flex w-full">
        {notFollowing.map((Element) => {
          return (
            <>
              <div
                className="flex justify-between pt-6 items-center max-xl:px-0 w-full"
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
                        className="w-12 h-12"
                      />
                      <h3 className="text-white/70 capitalize">
                        {Element.username}
                      </h3>
                    </div>
                  </a>
                </div>
                <button
                  className="color-item rounded-xl p-2 px-4 text-sm "
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
    </section>
  );
}

export default Recomendations;
