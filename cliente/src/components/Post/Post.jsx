import React from "react";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { format } from "timeago.js";
import axios from "axios";

const Post = ({ post, userprofile }) => {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [commentwriting, setcommentwriting] = useState("");
  const { user } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;

  useEffect(() => {}, [comments, like]);

  //funcion de likes
  const likeHandler = () => {
    try {
      axios.put("http://localhost:5050/posts/" + post._id + "/like", {
        userId: userprofile._id,
      }); //ruta del like
    } catch (err) {}

    if (like) {
      setIsLiked(false);
      setLike(like - 1);
    } else {
      setIsLiked(true);
      setLike(like + 1);
    }
  };

  //funcion de comentarios
  const addComment = async () => {
    const comment = {
      img: `${user.avatarImage}`,
      username: `${user.username}`,
      comment: `${commentwriting}`,
    };
    try {
      axios.put("http://localhost:5050/posts/" + post._id + "/comment", {
        userId: user._id,
        value: comment,
      });
    } catch (err) {}
    setComments(comments.concat(comment));
  };

  const handleComment = () => {
    window.location.reload();
    addComment();
  };

  return (
    <div className="max-ms:px-0 flex h-[50%]  w-[85%] flex-col gap-y-8 py-[2%] px-[2%] max-lg:w-[70%] max-md:pl-0 max-sm:w-[95%]">
      <div className=" flex w-[100%] flex-col  rounded-lg bg-white p-[2%] shadow-lg dark:bg-[#16181C] dark:text-white max-lg:p-0">
        <div className="flex h-16 w-full p-2">
          <div className="relative  flex w-full cursor-pointer items-center gap-4">
            <img
              src={`data:image/svg+xml;base64,${userprofile.avatarImage}`}
              className="h-12 w-12 rounded-lg"
              alt=""
            />

            <div className="flex flex-col ">
              <h2>{userprofile.username}</h2>

              <h4 className="text-xs font-extralight opacity-70">
                {format(post.createdAt)}
              </h4>
            </div>
          </div>
        </div>
        <p className="px-[3%] py-[1%] text-lg font-light max-lg:text-base">
          {post.desc}
        </p>
        <div className="w-full max-h-[400px] flex justify-center ">
          <img className=" " src={PF + post.img} alt="" />
        </div>

        <div className="flex w-full items-center gap-6  p-[2%]  ">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={likeHandler}
              viewBox="0 0 512 512"
              className="fill-red-600 w-5 h-6"
            >
              <path
                d={
                  isLiked === true
                    ? "M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                    : "M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"
                }
              />
            </svg>

            <h4 className="text-xs font-extralight">{like}</h4>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
            <h4 className="text-xs font-extralight">{comments.length}</h4>
          </div>
        </div>
        <div className="relative flex w-[100%] gap-5 p-[2%] ">
          <img
            src={`data:image/svg+xml;base64,${user.avatarImage}`}
            className="h-12 w-12 rounded-lg"
            alt=""
          />
          <input
            className="w-full rounded-lg bg-gray-100 p-2 pl-8 pr-16 text-sm outline-none text-black"
            placeholder="Escribi tu comentario"
            onChange={(e) => setcommentwriting(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute top-7 right-8 h-4 w-4 cursor-pointer opacity-70 dark:stroke-black"
            onClick={handleComment}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </div>
        {comments.map((item) => {
          return (
            <>
              <div className="relative flex w-[100%] gap-5 p-[2%] items-center">
                <img
                  key={item}
                  src={`data:image/svg+xml;base64,${item.value.img}`}
                  className="h-12 w-12 rounded-lg"
                  alt=""
                />

                <div>
                  <h1 className="font-bold text">{item.value.username}</h1>
                  <h1>{item.value.comment}</h1>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Post;
