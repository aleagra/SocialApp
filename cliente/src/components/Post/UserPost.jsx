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
      <div className="w-[100%] rounded-lg bg-white dark:text-white shadow-md dark:bg-[#0a0a13] py-5 mb-8">
        <div className="flex flex-col rounded-lg items-center">
          <div className="flex w-full px-10 gap-3 items-center">
            <ReactSVG
              src={`data:image/svg+xml;base64,${btoa(userData?.avatarImage)}`}
              className="color-item  rounded-full w-20 h-full"
            />
            <input
              type="text"
              placeholder="What's on your mind?"
              className="rounded-md flex justify-center m-auto  p-[6px] bg-transparent w-[100%] text-xl outline-none"
              required
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
            />
          </div>
          <div className="flex justify-between w-full pl-16 pr-10 pt-6 items-center">
            <div className="flex items-center gap-4">
              <label>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 plus cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>

                <input
                  className=" hidden cursor-pointer"
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>

              {/* <label>
                <svg //video
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-7 h-7 plus cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <input
                  className=" hidden"
                  type="file"
                  id="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                />
              </label> */}
            </div>
            <div className="flex justify-end">
              <button
                onClick={submitPost}
                onKeyDown={handleKey}
                type="button"
                id="btn"
                className="bg-black text-white text-lg p-1 px-3 rounded-md"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default userPost;
