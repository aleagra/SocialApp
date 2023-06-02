import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Aside } from "../components/Home";
import MyPosts from "../components/Profile/MyPosts";
import { ReactSVG } from "react-svg";
import Modal from "../components/Home/Modal";
import { CloseIcon, PenIcon, SettingsIcon } from "../utilities";
import { Link } from "react-router-dom";
import NavResponsive from "../components/Navbar/NavResponsive";

export default function Profile() {
  const { userData, setUserData, followingCount, followedUserData } =
    useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [followersUsers, setFollowersUsers] = useState([]);

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
  const updateMyData = (newData) => {
    // Actualiza el estado o realiza cualquier otra acción necesaria con los datos actualizados
    setUserData(newData); // Suponiendo que tienes un estado llamado userData y una función setUserData para actualizarlo
    console.log("Datos actualizados:", newData);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const resp = await axios.put(
      `http://localhost:5050/users/${userData._id}`,
      {
        fullName: fullName,
      }
    );
    const newData = {
      ...userData,
      fullName: fullName,
    };
    updateMyData(newData);
    console.log(resp.data);
    const response = await axios.put(
      `http://localhost:5050/posts/profilename/${userData._id}`,
      {
        fullName: fullName,
      }
    );

    window.location.reload();
  };
  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        if (Array.isArray(userData?.following)) {
          const userPromises = userData.following.map((userId) =>
            axios.get(`http://localhost:5050/users/${userId}`)
          );

          const users = await Promise.all(userPromises);
          const followingUsersData = users.map((response) => response.data);
          setFollowersUsers(followingUsersData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowingUsers();
  }, [userData?.following]);

  const [showModal, setShowModal] = useState(false);

  const openModa = () => {
    setShowModal(true);
  };

  const closeModa = () => {
    setShowModal(false);
  };

  return (
    <>
      <section className="flex w-full">
        <div className="fixed z-20">
          <Aside />
          <NavResponsive />
        </div>
        <form
          onSubmit={handleClick}
          encType="multipart/form-data"
          className="w-full"
        >
          <div className="relative w-full justify-center max-md:px-4 items-center min-h-screen h-screen">
            <div className="flex flex-col h-full dark:text-white ml-[35%] mr-[15%] max-md:p-0 max-md:m-0">
              <div className="relative mb-[4rem] xl:pt-20 flex flex-col">
                <div className="flex flex-col relative bg-white dark:bg-[#0a0a13] rounded-lg shadow-md">
                  <div className="w-full flex-col h-fit py-12 justify-center relavite flex items-center gap-5">
                    <div className="flex items-end">
                      <ReactSVG
                        src={`data:image/svg+xml;base64,${btoa(
                          userData?.avatarImage
                        )}`}
                        className="color-item rounded-full w-[8rem] h-[8rem]"
                      />
                      <div
                        className="color-item rounded-full p-1 h-fit cursor-pointer"
                        onClick={openModa}
                      >
                        <PenIcon />
                      </div>
                    </div>
                    <div className="flex flex-col p-2 text-center text-xl w-[220px]">
                      <h1 className="font-bold capitalize whitespace-nowrap">
                        {userData?.fullName}
                      </h1>
                      <h1 className="font-light capitalize">
                        @{userData?.username}
                      </h1>
                    </div>
                    <div className="flex w-full justify-between px-14">
                      <div className="flex text-center text-xl gap-2 flex-col">
                        <span className="font-bold">
                          {userData?.followers.length}
                        </span>
                        <p>Followers </p>
                      </div>
                      <div
                        onClick={openModal}
                        className="flex cursor-pointer text-center text-xl gap-2 flex-col"
                      >
                        <span className="font-bold">{followingCount}</span>
                        <p>Followings </p>
                      </div>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <Modal
                    title={"Following"}
                    isOpen={isOpen}
                    closeModal={closeModal}
                    style={`bg-white dark:bg-[#0a0a13] overflow-y-scroll absolute right-[35rem] top-[15rem] py-6 rounded-lg shadow-sm modal-content z-20 w-[25%] max-xl:hidden h-[25rem] transition-opacity duration-300 ease-out`}
                    content={
                      <div>
                        {" "}
                        {followersUsers.map((element, key) => (
                          <a href={"/" + element._id}>
                            <div
                              className="flex py-6 px-6 pl-10 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10"
                              key={element._id}
                            >
                              <div className="text-center flex items-center gap-4">
                                <ReactSVG
                                  src={`data:image/svg+xml;base64,${btoa(
                                    element.avatarImage
                                  )}`}
                                  className="color-item rounded-full w-16 h-16"
                                />

                                <h3 className="text capitalize font-bold text-xl">
                                  {element.username}
                                </h3>
                              </div>
                            </div>
                          </a>
                        ))}
                        {followedUserData?.map((element, key) => (
                          <a href={"/Profile/" + element._id}>
                            <div
                              className="flex py-6 px-6 pl-10 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10"
                              key={element._id}
                            >
                              <div className="text-center flex items-center gap-4">
                                <ReactSVG
                                  src={`data:image/svg+xml;base64,${btoa(
                                    element.avatarImage
                                  )}`}
                                  className="color-item rounded-full w-16 h-16"
                                />
                                <h3 className="text capitalize font-bold text-xl">
                                  {element.username}
                                </h3>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    }
                  />
                )}
              </div>
              <MyPosts />
            </div>
          </div>
        </form>
        {showModal && (
          <div className="fixed top-0 left-[12rem] w-screen h-screen bg-black bg-opacity-50 flex justify-center ">
            <div className="bg-white dark:bg-[#0a0a13] h-[26rem] dark:text-white mt-20 w-[25%] rounded-lg relative py-6">
              <div
                className="absolute left-10 top-8 cursor-pointer"
                onClick={closeModa}
              >
                <CloseIcon />
              </div>
              <h1 className=" text-xl capitalize text-center border-b-2 py-2">
                edit profile
              </h1>
              <div className="flex flex-col  pt-12 justify-center gap-y-6 px-16">
                <div className="flex items-center gap-6">
                  <ReactSVG
                    src={`data:image/svg+xml;base64,${btoa(
                      userData?.avatarImage
                    )}`}
                    className="color-item  rounded-full w-[4rem] h-[4rem]"
                  />
                  <div className="flex  text-md flex-col text-lg">
                    <span className="font-semibold">@{userData?.username}</span>
                    <Link to="/setAvatar" className="cursor-pointer text">
                      Change avatar
                    </Link>
                  </div>
                </div>
                <form action="" onSubmit={handleClick}>
                  <div className="flex gap-6 items-center py-8">
                    <p className="font-bold">Name:</p>
                    <input
                      type="text"
                      className="border rounded-md px-5 text-center py-1 dark:bg-transparent boder"
                      placeholder={userData?.fullName}
                      maxLength="20"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-center w-full h-fit py-5">
                    <button
                      className="p-2 color-item rounded-md w-fit h-fit whitespace-nowrap"
                      type="submit"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
