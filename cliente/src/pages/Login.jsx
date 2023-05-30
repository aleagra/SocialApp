import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import icon from "../assets/icon.png";
export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [values, setValues] = useState({ username: "", password: "" });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { username, password } = values;

    if (!username || !password) {
      toast.error("Username and password are required.", toastOptions);
      return;
    }

    const { data } = await axios.post("http://localhost:5050/users/login", {
      username,
      password,
    });

    if (data.status === false) {
      toast.error(data.msg, toastOptions);
    } else {
      const user = data.user;
      dispatch({ type: "LOGIN_SUCCESS", payload: user._id });
      navigate("/");
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div>
        <section className="h-screen w-full flex flex-col justify-center gap-[1rem] items-center bg-[#f7f7f7] dark:bg-[#131324]">
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col gap-[2rem] bg-white dark:bg-[#00000076] shadow-md rounded-lg p-[5rem]"
          >
            <div className="flex items-center gap-[1rem] justify-center">
              <img src={icon} alt="" className="w-10 h-auto" />
              <h1 className="font-semibold text-lg text-black dark:text-white ">
                SOCIAL MEDIA APP
              </h1>
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="bg-transparent p-[1rem] border-solid rounded-lg w-full  border-color outline-none   dark:text-white"
              onChange={(e) => handleChange(e)}
              min="3"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent p-[1rem] border-solid rounded-lg  w-full  border-color dark:text-white outline-none"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <button
              type="submit"
              className="color-item py-3 font-bold cursor-pointer rounded-lg text-lg text-white uppercase"
            >
              Log In
            </button>
            <span className="dark:text-white uppercase">
              Don't have an account?{" "}
              <Link to="/register" className="text">
                Create One.
              </Link>
            </span>
          </form>
        </section>
        <ToastContainer />
      </div>
    </>
  );
}
