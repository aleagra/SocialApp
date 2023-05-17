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
      <div
        className="modal fade fixed hidden  h-full w-[20%] top-[7%] right-0 overflow-y-auto overflow-x-hidden outline-none"
        id="exampleModalNotificacion"
        tabIndex="-1"
        aria-labelledby="exampleModalNotificacion"
        aria-modal="true"
        role="dialog"
      >
        <div className="flex h-[70%] w-[90%] m-auto bg-white  dark:bg-[#16181C] dark:text-white shadow-lg rounded-lg ">
          <div className="modal-dialog pointer-events-none relative w-full ">
            <div className="modal-content pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white dark:bg-[#16181C] bg-clip-padding text-current outline-none">
              <div className="modal-body relative p-4">
                <div className="flex w-full justify-center">
                  <h1 className="text-lg font-light mb-5 mt-2">
                    Notificaciones
                  </h1>
                </div>
                {notifications.map((Element, key) => {
                  return (
                    <>
                      <a
                        href={"/Profile/" + Element._id}
                        className=""
                        key={Element._id}
                      >
                        <div className="relative flex w-full py-3 border-notificacion gap-5 p-[2%] items-center text-black dark:text-white ">
                          <div className="w-[15%]">
                            <img
                              src={`data:image/svg+xml;base64,${Element.avatarImage}`}
                              alt=""
                              className=""
                            />
                          </div>
                          <h1 className="font-extralight">
                            <span className="font-bold">
                              {Element.username}
                            </span>{" "}
                            ha comenzado a seguirte.
                          </h1>
                        </div>
                      </a>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notifications;
