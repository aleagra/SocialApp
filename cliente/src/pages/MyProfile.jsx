import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";

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

  const handleLogout = () => {
    // Limpiar los datos del usuario en el contexto de autenticación
    dispatch({ type: "LOGOUT" });

    // Limpiar los datos del usuario en el localStorage
    localStorage.removeItem("user");

    // Redirigir al usuario a la página de inicio de sesión
    navigate("/login");
  };

  return (
    <>
      <section>
        <Navbar />

        <form onSubmit={handleClick} encType="multipart/form-data">
          <div className="relative pb-2 h-full mt-20 justify-center items-center">
            <div className="flex flex-col pb-5 dark:text-white">
              <div className="relative flex flex-col mb-7">
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={user.background}
                    alt=""
                    className="w-full h-60 2xl:h-510 shadow-lg object-cover rounded-lg"
                  />
                  <img
                    src={`data:image/svg+xml;base64,${user.avatarImage}`}
                    className="rounded-full w-40 h-40 -mt-10 shadow-2xl object-cover"
                    alt=""
                  />
                  <h1 className="font-bold text-3xl text-center mt-3 mb-10">
                    {user.username}
                  </h1>
                  <h5 className=" text-center mb-8 mt-0">{user.descripcion}</h5>
                  <div className=" flex flex-row mt-0 mb-10">
                    @{user.username}
                  </div>
                </div>

                <div className="text-center mb-7">
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
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
