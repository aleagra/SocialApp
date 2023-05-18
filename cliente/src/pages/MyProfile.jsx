import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import { Aside } from "../components/Home";

export default function Profile() {
  const { user, setUser, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [background, setBackground] = useState("");
  const [descripcion, setDescripcion] = useState("");

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

  return (
    <>
      <section>
        <Aside />

        <form onSubmit={handleClick} encType="multipart/form-data">
          <div className="relative justify-center items-center min-h-screen h-screen ">
            <div className="flex flex-col bg-white dark:bg-[#17181c] h-full dark:text-white ml-[35%] mr-[15%] max-lg:m-0 max-lg:overflow-hidden">
              <div className="relative flex flex-col border-2 border-white/30">
                <div className="flex flex-col pt-4 relative items-center ">
                  <img
                    src={user.background}
                    alt=""
                    className="min-h-[250px] max-h-[250px] w-[100%] rounded-lg object-cover "
                  />
                  <div className="w-full absolute top-[12rem] left-[3rem] flex justify-between">
                    <img
                      src={`data:image/svg+xml;base64,${user.avatarImage}`}
                      className="rounded-full w-[10rem] h-[10rem] border-8 dark:border-[#17181c] border-white"
                      alt=""
                    />
                    <button className="p-2 w-fit rounded-md h-fit text-white container mt-[6rem] mr-[6rem]">
                      Edit profile
                    </button>
                  </div>
                  {/* <h1 className="font-bold text-xl capitalize ">
                    {user.username}
                    <h5 className="">{user.descripcion}</h5>
                  </h1> */}
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
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
