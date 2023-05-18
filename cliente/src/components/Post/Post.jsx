import React from "react";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { format } from "timeago.js";
import axios from "axios";

const Post = ({ post, userprofile }) => {
  const [isLiked, setIsLiked] = useState();
  const [comments, setComments] = useState(post.comments);
  const [commentwriting, setcommentwriting] = useState("");
  const { user } = useContext(AuthContext);
  const PF = "http://localhost:5050/images/";
  const [toggle, setTogle] = useState(true);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/posts/${post._id}/checkLike/${user._id}`
        );
        setIsLiked(response.data);
      } catch (err) {}
    };

    fetchLikeStatus();
  }, [post._id, user._id]);

  const likeHandler = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/posts/${post._id}/checkLike/${user._id}`
      );
      const hasLiked = response.data;

      if (hasLiked) {
        await axios.put(`http://localhost:5050/posts/${post._id}/like`, {
          userId: user._id,
        });
        setLikesCount(likesCount - 1);
        setIsLiked(false);
      } else {
        if (!isLiked) {
          await axios.put(`http://localhost:5050/posts/${post._id}/like`, {
            userId: user._id,
          });
          setLikesCount(likesCount + 1);
          setIsLiked(true);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    setLikesCount(post.likes.length);
  }, [post.likes.length]);

  useEffect(() => {
    setComments(comments);
  }, [comments]);

  const addComment = async () => {
    const comment = {
      img: user.avatarImage,
      username: user.username,
      comment: commentwriting,
    };
    try {
      await axios.put("http://localhost:5050/posts/" + post._id + "/comment", {
        userId: user._id,
        value: comment,
      });
      // Obtener los comentarios actualizados desde el servidor
      const response = await axios.get(
        "http://localhost:5050/posts/" + post._id + "/comments"
      );
      setComments(response.data.comments);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    await addComment();
    setcommentwriting("");
  };

  const toggleComments = () => {
    setTogle(!toggle);
  };
  return (
    <div className="max-ms:px-0 flex w-[90%] flex-col gap-y-8 dark:border dark:border-white/20 rounded-md">
      <div className=" flex w-[100%] flex-col   bg-white shadow-lg dark:bg-[#17181c] dark:text-white max-lg:p-0">
        <div className="flex h-24 w-full px-6 py-2">
          <div className="relative  flex w-full cursor-pointer items-center gap-3">
            <img
              src={`data:image/svg+xml;base64,${userprofile.avatarImage}`}
              className="h-12 w-12 rounded-lg"
              alt=""
            />

            <div className="flex flex-col text-md font-light capitalize">
              <h2>{userprofile.username}</h2>

              <h4 className="text-md font-extralight opacity-40">
                {format(post.createdAt)}
              </h4>
            </div>
          </div>
        </div>
        <p className="px-6 pb-4  text-lg max-lg:text-base">{post.desc}</p>
        <div className="w-full max-h-[400px] flex justify-center ">
          <img className="w-full object-cover" src={PF + post.img} alt="" />
        </div>

        <div className="flex w-full items-center justify-between px-6 py-6 ">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={likeHandler}
              viewBox="0 0 512 512"
              className={`${
                isLiked ? "fill-red-600" : "fill-white"
              } w-6 h-6 cursor-pointer`}
            >
              <path
                d={
                  isLiked === true
                    ? "M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                    : "M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"
                }
              />
            </svg>

            <h4 className="text-md font-extralight">{likesCount}</h4>
            <p className="text-md">Likes</p>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
              />
            </svg>

            <h4 className="text-md font-extralight">{comments.length}</h4>
            <p className="text-md">Shares</p>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleComments}
          >
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
            <h4 className="text-md font-extralight">{comments.length}</h4>
            <p className="text-md">Comments</p>
          </div>
        </div>
        {!toggle && (
          <div>
            <div
              className={`relative items-center flex w-[100%] gap-5 p-6  border-t dark:border-white/40 border-black/40`}
            >
              <img
                src={`data:image/svg+xml;base64,${user.avatarImage}`}
                className="h-12 w-12 rounded-lg"
                alt=""
              />
              <input
                className="w-full m-auto p-2 rounded-xl bg-gray-100 dark:bg-transparent dark:border dark:text-white dark:border-white/40  pl-3 pr-10 text-sm outline-none text-black"
                placeholder="Escribi tu comentario"
                onChange={(e) => setcommentwriting(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="absolute top-10 right-10 h-4 w-4 cursor-pointer opacity-70 "
                onClick={(e) => {
                  handleComment();
                  toggleComments();
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </div>
            {comments.map((item, index) => (
              <div
                className="relative flex w-[100%] gap-5 p-[2%] items-center"
                key={index}
              >
                <img
                  src={`data:image/svg+xml;base64,${item.value.img}`}
                  className="h-12 w-12 rounded-lg"
                  alt=""
                />
                <div>
                  <h1 className="font-bold text">{item.value.username}</h1>
                  <h1>{item.value.comment}</h1>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
