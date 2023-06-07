import React from "react";
import { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import app from "../../Storage";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import CloseIcon from "../../utilities/icons/CloseIcon";

import { ReactSVG } from "react-svg";
const userPost = () => {
  const { userData } = useContext(AuthContext);
  const [file, setFile] = useState("");
  const [video, setVideo] = useState(null);
  const [inputStr, setInputStr] = useState("");

  const submitPost = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: userData._id,
      desc: inputStr,
      user: userData,
    };

    //imagen
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
      try {
        await axios.post("http://localhost:5050/upload", data);
      } catch (err) {}
    }
    video;
    if (video) {
      const fileName = new Date().getTime() + video.name;
      const storage = getStorage(app);
      const StorageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(StorageRef, video);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const uploadVideo = {
              userId: userData._id,
              desc: inputStr,
              video: downloadURL,
            };
            try {
              axios.post("http://localhost:5050/posts/", uploadVideo);
              window.location.reload();
            } catch (err) {}
          });
        }
      );
    }
    //texto
    else
      try {
        await axios.post("http://localhost:5050/posts/", newPost);
        window.location.reload();
      } catch (err) {}
  };

  const handleKey = (e) => {
    e.code === "Enter" && submitPost();
  };

  return (
    <>
      <div className="w-[100%] rounded-lg bg-white dark:text-white shadow-md dark:bg-[#0a0a13] py-6 mb-10">
        <div className="flex flex-col rounded-lg items-center">
          <div className="flex w-full pr-6 pl-10 gap-3 ">
            <ReactSVG
              src={`data:image/svg+xml;base64,${btoa(userData?.avatarImage)}`}
              className="color-item  rounded-full w-16 h-fit"
            />

            <div className="flex flex-col w-full">
              <p className="whitespace-nowrap text-lg capitalize text font-semibold">
                {userData?.fullName}
              </p>
              <textarea
                placeholder="What's on your mind?"
                className="rounded-md flex justify-center mt-2 h-[75px] bg-transparent px-4 w-full text-xl outline-none border border-gray-100 dark:border-white/10"
                maxLength={200}
                required
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value)}
                style={{ resize: "none" }}
              />
              {file && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Vista previa de la imagen"
                    className="max-w-[800px] max-h-[500px] object-cover rounded-lg mt-6 max-md:max-w-[245px] max-md:min-w-[200px]"
                  />
                  <div
                    className="absolute top-10 left-4 p-2 bg-white/30 dark:bg-black/40 rounded-full cursor-pointer"
                    onClick={() => setFile("")}
                  >
                    <CloseIcon />
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center mt-8">
                <label className="p-1 hover:bg-black/10 hover:dark:bg-white/30 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 plus cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>

                  <input
                    className="hidden cursor-pointer"
                    type="file"
                    id="file"
                    accept=".png,.jpeg,.jpg"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (file !== "" || inputStr !== "") {
                      submitPost(e);
                    }
                  }}
                  onKeyDown={handleKey}
                  type="button"
                  id="btn"
                  className={` ${
                    file === "" && inputStr === ""
                      ? "opacity-60"
                      : "opacity-100"
                  }  bg-black text-white text-lg p-[1px] px-4 rounded-full`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default userPost;
