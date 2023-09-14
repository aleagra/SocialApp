import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { ReactSVG } from "react-svg";
import { io as socketIOClient } from "socket.io-client";
import { Link } from "react-router-dom";
import { hostLink } from "../../utilities/host";

function Recomendations() {
  const { user, setFollowingCount, userData, updateFollowedUserData } =
    useContext(AuthContext);
  const [notFollowing, setNotFollowing] = useState([]);
  const [followersUsers, setFollowersUsers] = useState([userData?.following]);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = socketIOClient(`${hostLink}`);
    socket.current.emit("add-user", user);
    socket.current.on("follower-count-updated", ({ userId, followerCount }) => {
      if (userId === user) {
        setFollowingCount(followerCount);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user, setFollowingCount]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${hostLink}/users/not-following/${user}`
        );
        const usersWithCount = response.data.map((user) => ({
          _id: user._id,
          username: user.username,
          avatarImage: user.avatarImage,
        }));

        setNotFollowing(usersWithCount);
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
        const response = await axios.get(`${hostLink}/users/${user}`);
        const userData = response.data;
        setFollowingCount(userData?.following.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [user, setFollowingCount]);

  useEffect(() => {
    const storedNotFollowing = localStorage.getItem("notFollowing");
    if (storedNotFollowing) {
      setNotFollowing(JSON.parse(storedNotFollowing));
    }
  }, []);

  const handleFollow = async (id) => {
    try {
      // Update the user object in notFollowing to indicate that it is being followed
      const updatedList = notFollowing.map((user) => {
        if (user._id === id) {
          return {
            ...user,
            following: true,
          };
        }
        return user;
      });

      setNotFollowing(updatedList);
      localStorage.setItem("notFollowing", JSON.stringify(updatedList));

      await axios.post(`${hostLink}/users/follow/${user}`, {
        follower: id,
      });

      socket.current.emit("follow-user", {
        userId: user,
        followerId: id,
      });

      // Perform the GET requests in the background
      Promise.all([
        axios.get(`${hostLink}/users/${id}`),
        axios.get(`${hostLink}/users/followed/${user}`),
      ]).then(([response1, response2]) => {
        const followedUserData = response1.data;
        const followerData = response2.data;

        setFollowersUsers((prevFollowers) => [
          ...prevFollowers,
          followedUserData,
        ]);

        updateFollowedUserData((prevData) => [...prevData, followedUserData]);
        updateFollowersData((prevData) => [...prevData, followerData]);

        socket.current.emit("follower-count-updated", {
          userId: user,
          followerCount: followerData.length,
        });
      });
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
            {notFollowing.slice(0, 3).map((element) => (
              <div
                className="flex justify-between max-2xl:gap-6 pt-6 items-center max-xl:px-0 w-full"
                key={element._id}
              >
                <div className="flex w-full items-center">
                  <Link
                    className="flex items-center justify-evenly w-full"
                    to={`/${element._id}`}
                  >
                    <div className="w-full text-center flex items-center gap-4">
                      <ReactSVG
                        src={`data:image/svg+xml;base64,${btoa(
                          element.avatarImage
                        )}`}
                        className="color-item rounded-full w-16 h-auto"
                      />
                      <h3 className="dark:text-white/70 capitalize">
                        {element.username}
                      </h3>
                    </div>
                  </Link>
                </div>
                <div>
                  <button
                    className={` rounded-xl p-2 px-4 text-sm  ${
                      element.following
                        ? "bg-white border border-black/20 text cursor-default"
                        : "text-white color-item"
                    }`}
                    id={`follow-btn-${element._id}`}
                    onClick={() => handleFollow(element._id)}
                  >
                    {element.following ? "Following" : "Follow"}
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
