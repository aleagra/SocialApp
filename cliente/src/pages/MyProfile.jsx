import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Aside } from "../components/Home";
import MyPosts from "../components/Profile/MyPosts";
import { ReactSVG } from "react-svg";

export default function Profile() {
  const { userData, setUser, followingCount, followedUserData } =
    useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [background, setBackground] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [followersUsers, setFollowersUsers] = useState([]);
  const updateMyData = (newData) => {
    setUser(newData);
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      var bodyFormData = new FormData();
      bodyFormData.append("username", username);
      bodyFormData.append("descripcion", descripcion);
      bodyFormData.append("background", background[0]);
      const resp = await axios.put(
        `http://localhost:5050/users/${user._id}`,
        bodyFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const newData = {
        ...user,
        username: username,
        descripcion: descripcion,
        background: URL.createObjectURL(background[0]),
      };
      updateMyData(newData);
      window.location.reload();
      console.log(resp.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      console.log(userData?.following);
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
  console.log(userData?.following);
  return (
    <>
      <section className="flex w-full">
        <div className="fixed z-20">
          <Aside />
        </div>
        <form
          onSubmit={handleClick}
          encType="multipart/form-data"
          className="w-full"
        >
          <div className="relative  w-full justify-center items-center min-h-screen h-screen ">
            <div className="flex flex-col  h-full dark:text-white mt-12 ml-[35%] mr-[15%] max-lg:m-0 max-lg:overflow-hidden">
              <div className="relative mb-[4rem] flex flex-col ">
                <div className="flex flex-col pt-4 relative items-centee">
                  <img
                    src={userData?.background}
                    alt=""
                    className="min-h-[250px] max-h-[250px] w-[100%] object-cover "
                  />
                  <div
                    className="w-full h-[7rem] justify-end px-2 rounded-md shadow-lg flex items-center bg-white dark:bg-[#0a0a13] gap-16
                    "
                  >
                    <ReactSVG
                      src={`data:image/svg+xml;base64,${btoa(
                        userData?.avatarImage
                      )}`}
                      className="color-item  rounded-full w-[8rem] h-auto absolute left-10 bottom-10 "
                    />

                    <h1 className="text-xl font-bold capitalize p-2">
                      {userData?.username} sanchez
                    </h1>
                    <div className="flex  justify-center text-center text-xl gap-2">
                      <span className="font-bold">
                        {userData?.followers.length}
                      </span>
                      <p>Followers </p>
                    </div>
                    <div className="flex  justify-center text-center text-xl gap-2">
                      <span className="font-bold">{followingCount}</span>
                      <p>Followings </p>
                    </div>
                    <button className="p-2 w-fit rounded-md text-xl h-fit text-white container mr-10 ">
                      Edit profile
                    </button>
                  </div>
                </div>

                <div
                  className={` bg-white dark:bg-[#0a0a13] absolute right-28 top-16 py-6 rounded-lg shadow-sm modal-content z-20 w-full max-xl:hidden h-[25rem] transition-opacity  duration-300 ease-out`}
                >
                  <div className="w-full relative py-4 flex justify-center border-b-2">
                    <p className="text-center dark:text-white">Seguidores</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 cursor-pointer absolute left-10 dark:stroke-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  {followersUsers.map((element, key) => (
                    <a href={"/Profile/" + element._id}>
                      <div
                        className="flex  py-6 px-6 pl-10 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10 "
                        key={element._id}
                      >
                        <div className=" text-center flex items-center gap-4">
                          <ReactSVG
                            src={`data:image/svg+xml;base64,${btoa(
                              element.avatarImage
                            )}`}
                            className="color-item  rounded-full w-16 h-16"
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
                        className="flex  py-6 px-6 pl-10 items-center max-xl:px-0 w-full dark:hover:bg-white/20 hover:bg-black/10 "
                        key={element._id}
                      >
                        <div className=" text-center flex items-center gap-4">
                          <ReactSVG
                            src={`data:image/svg+xml;base64,${btoa(
                              element.avatarImage
                            )}`}
                            className="color-item  rounded-full w-16 h-16"
                          />
                          <h3 className="text capitalize font-bold text-xl">
                            {element.username}
                          </h3>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* <div className="text-center mb-7">
                  <div className="flex justify-center gap-4">
                    <div className="w-full flex justify-center">
                      <div className="w-auto flex gap-3 justify-center sm: flex-col">
                        <Link to="/login">
                          <button
                            className="rounded-lg w-auto container p-2 border-none cursor-pointer"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </Link>

                        <button
                          type="button"
                          id="btn"
                          className="border w-auto p-2 container cursor-pointer rounded-lg"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModalEdit"
                        >
                          Edit
                        </button>
                      </div>
                      <div
                        className="modal fade fixed hidden h-full w-[30%] top-[50%] right-11 overflow-y-auto overflow-x-hidden outline-none"
                        id="exampleModalEdit"
                        tabIndex="-1"
                        aria-labelledby="exampleModalEdit"
                        aria-modal="true"
                        role="dialog"
                      >
                        <div className="flex h-[20%] w-full m-auto bg-white  dark:bg-[#16181C] dark:text-white shadow-lg rounded-lg ">
                          <div className="modal-dialog pointer-events-none relative w-full ">
                            <div className="modal-content pointer-events-auto relative flex w-full flex-col rounded-md shadow-lg border-search bg-white dark:bg-[#16181C] bg-clip-padding text-current outline-none">
                              <div className="modal-body relative p-4  ">
                                <div className="flex w-full flex-col gap-4 justify-center items-center">
                                  <h1 className="font-bold">
                                    Edit your profile
                                  </h1>
                                  <input
                                    className="border-search rounded-lg p-2 text-black w-10/12"
                                    placeholder="Change your name"
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                      setUsername(e.target.value)
                                    }
                                  />
                                  <input
                                    className="border-search rounded-lg p-2 text-black w-10/12"
                                    placeholder="Change your description"
                                    type="text"
                                    value={descripcion}
                                    onChange={(e) =>
                                      setDescripcion(e.target.value)
                                    }
                                  />

                                  <div className="flex flex-col items-center gap-2 ">
                                    <label
                                      className=" font-bold text-sm text-gray-900 dark:text-white cursor-pointer"
                                      htmlFor="file_input"
                                    >
                                      Set background
                                      <input
                                        className=" w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer hidden "
                                        id="file_input"
                                        type="file"
                                        onChange={(e) =>
                                          setBackground(e.target.files)
                                        }
                                      />
                                    </label>
                                  </div>
                                  <button
                                    className="border w-[50%] container cursor-pointer rounded-lg font-extralight p-2 text-white"
                                    type="submit"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <MyPosts />
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
