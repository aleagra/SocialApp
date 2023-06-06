import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(user.followers);

  const fetchUserData = async () => {
    try {
      const userIds = notifications.map((notification) => notification);
      const userPromises = userIds.map(async (userId) => {
        const response = await fetch(`http://localhost:5050/users/${userId}`);
        return response.json();
      });
      const userData = await Promise.all(userPromises);
      setNotifications(userData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <>
      <section className="flex absolute top-0 left-0 w-full justify-center z-10">
        <div className="flex absolute top-0 left-0 w-full justify-center">
          <h1 className="text-lg font-light mb-5 mt-2">Notificaciones</h1>
        </div>
        {notifications.map((Element, key) => {
          return (
            <>
              <a
                href={"/Profile/" + Element._id}
                className=""
                key={Element._id}
              >
                <div className="relative flex w-full py-3 border-notificacion p-[2%] items-center text-black dark:text-white">
                  <div className="w-[15%]">
                    <img
                      src={`data:image/svg+xml;base64,${Element.avatarImage}`}
                      alt=""
                      className=""
                    />
                  </div>
                  <h1 className="font-extralight">
                    <span className="font-bold">{Element.username}</span> ha
                    comenzado a seguirte.
                  </h1>
                </div>
              </a>
            </>
          );
        })}
      </section>
    </>
  );
}

export default Notifications;
