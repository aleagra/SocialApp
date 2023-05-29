import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import icon from "../assets/icon.png";
const Register = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [values, setValues] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be the same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password, fullName } = values;
      const { data } = await axios.post(
        "http://localhost:5050/users/register",
        {
          username,
          email,
          fullName,
          password,
        }
      );

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        dispatch({ type: "LOGIN_SUCCESS", payload: data.user._id });
        localStorage.setItem("user", JSON.stringify(data.user._id));
        navigate("/setAvatar");
      }
    }
  };

  return (
    <>
      <section className="flex flex-col w-full h-screen justify-center gap-[1rem] items-center bg-[#f7f7f7] dark:bg-[#131324]">
        <form
          action=""
          className="flex flex-col gap-[2rem] rounded-lg bg-white dark:bg-[#00000076] p-[5rem] "
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-[1rem] justify-center">
            <img src={icon} alt="" className="w-10 h-auto" />
            <h1 className="text-blacK dark:text-white uppercase font-bold text-lg">
              social media app
            </h1>
          </div>
          <input
            className="bg-transparent p-[1rem] rounded-lg text-black dark:text-white w-full text-[1rem] border-color focus:outline-none"
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />
          <input
            className="bg-transparent p-[1rem] rounded-lg text-black dark:text-white w-full text-[1rem] border-color focus:outline-none"
            type="text"
            placeholder="Full Name"
            name="fullName"
            onChange={handleChange}
          />
          <input
            className="bg-transparent p-[1rem] rounded-lg text-black dark:text-white w-full text-[1rem]  border-color focus:outline-none"
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <input
            className="bg-transparent p-[1rem] text-black dark:text-white rounded-lg w-full text-[1rem] border-color focus:outline-none"
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <input
            className="bg-transparent p-[1rem] text-black dark:text-white rounded-lg w-full text-[1rem] border-color border focus:outline-none"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="color-item py-3 font-bold cursor-pointer  rounded-lg text-lg text-white uppercase"
          >
            Create Account
          </button>
          <span className="uppercase text-black dark:text-white">
            Already have an account?{" "}
            <Link to="/login" className="text font-bold">
              Login.
            </Link>
          </span>
        </form>
      </section>
      <ToastContainer />
    </>
  );
};
export default Register;
