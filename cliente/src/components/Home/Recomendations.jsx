import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { ReactSVG } from "react-svg";
import { io as socketIOClient } from "socket.io-client";
import { Link } from "react-router-dom";
function Recomendations() {
  const { user, setFollowingCount, userData, updateFollowedUserData } =
    useContext(AuthContext);
  const [notFollowing, setNotFollowing] = useState([]);
  const [followersUsers, setFollowersUsers] = useState([userData?.following]);
  const socket = useRef(null);

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
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `https://socialapp-backend-production-a743.up.railway.app/users/not-following/${user}`
        );
        const usersWithCount = response.data.map((user) => ({
          _id: user._id,
          username: user.username,
          avatarImage: user.avatarImage,
        }));
        setNotFollowing(usersWithCount);

        // Guardar solo los campos necesarios en el Local Storage
        const usersToSave = usersWithCount.map((user) => ({
          _id: user.id,
          username: user.username,
          avatarImage: user.avatarImage,
        }));
        localStorage.setItem("notFollowing", JSON.stringify(usersToSave));
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://socialapp-backend-production-a743.up.railway.app/users/${user}`
        );
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
      // Actualizar el estado primero
      const response = await axios.get(
        `https://socialapp-backend-production-a743.up.railway.app/users/${id}`
      );
      const followedUserData = response.data;

      setFollowersUsers((prevFollowers) => {
        const updatedList = [...prevFollowers];
        updatedList.push(followedUserData);
        return updatedList;
      });

      const updatedList = notFollowing.filter((user) => user._id !== id);
      setNotFollowing(updatedList);
      localStorage.setItem("notFollowing", JSON.stringify(updatedList));
      updateFollowedUserData((prevData) => [...prevData, followedUserData]);

      // Realizar la gestión en la base de datos después de actualizar el estado
      await axios.post(
        `https://socialapp-backend-production-a743.up.railway.app/users/follow/${user}`,
        {
          follower: id,
        }
      );

      // Emitir el evento después de la gestión en la base de datos
      socket.current.emit("follow-user", {
        userId: user,
        followerId: id,
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
