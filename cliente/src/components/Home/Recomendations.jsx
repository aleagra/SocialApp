import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { ReactSVG } from "react-svg";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
function Recomendations() {
  const { user, setFollowingCount, userData, updateFollowedUserData } =
    useContext(AuthContext);
  const [notFollowing, setNotFollowing] = useState([]);
  const [followersUsers, setFollowersUsers] = useState([userData?.following]);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/users/not-following/${user}`
        );
        const usersWithCount = response.data.map((user) => ({
          ...user,
          followingCount: user.followingCount,
        }));
        setNotFollowing(usersWithCount);

        // Guardar la lista en el Local Storage
        localStorage.setItem("notFollowing", JSON.stringify(usersWithCount));
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/users/${user}`);
        const userData = response.data;
        setFollowingCount(userData?.following.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const storedNotFollowing = localStorage.getItem("notFollowing");
    if (storedNotFollowing) {
      setNotFollowing(JSON.parse(storedNotFollowing));
    }
  }, []);

  const handleFollow = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5050/users/${id}`);
      const followedUserData = response.data;
      await axios.post(`http://localhost:5050/users/follow/${user}`, {
        follower: id,
      });
      setFollowersUsers((prevFollowers) => {
        const updatedList = [...prevFollowers];
        updatedList.push(followedUserData);

        return updatedList;
      });

      const updatedList = notFollowing.filter((user) => user._id !== id);
      setNotFollowing(updatedList);
      localStorage.setItem("notFollowing", JSON.stringify(updatedList));

      socket.current.emit("follow-user", {
        userId: user,
        followerId: id,
      });
      updateFollowedUserData((prevData) => [...prevData, followedUserData]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {notFollowing.length > 0 && (
        <section className="py-6 px-8 max-2xl:px-4 rounded-md shadow-lg bg-white dark:text-white dark:bg-[#0a0a13]">
          <p className="font-semibold">RECOMMENDATIONS</p>
          <div className="flex w-full flex-col">
            {notFollowing.slice(0, 3).map((Element) => (
              <div
                className="flex justify-between max-2xl:gap-6 pt-6 items-center max-xl:px-0 w-full"
                key={Element._id}
              >
                <div className="flex w-full items-center">
                  <Link
                    className="flex items-center justify-evenly w-full"
                    to={`/${Element._id}`}
                  >
                    <div className="w-full text-center flex items-center gap-4">
                      <ReactSVG
                        src={`data:image/svg+xml;base64,${btoa(
                          Element.avatarImage
                        )}`}
                        className="color-item rounded-full w-16 h-auto"
                      />
                      <h3 className="dark:text-white/70 capitalize">
                        {Element.username}
                      </h3>
                    </div>
                  </Link>
                </div>
                <div>
                  <button
                    className="color-item rounded-xl p-2 px-4 text-sm text-white"
                    id={`follow-btn-${Element._id}`}
                    onClick={() => handleFollow(Element._id)}
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Recomendations;
