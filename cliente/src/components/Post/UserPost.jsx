import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import CloseIcon from "../../utilities/icons/CloseIcon";
import { v4 as uuidv4 } from "uuid";
import { ReactSVG } from "react-svg";
import { ImgIcon } from "../../utilities";
const userPost = () => {
  const { userData } = useContext(AuthContext);
  const [file, setFile] = useState("");
  const [inputStr, setInputStr] = useState("");

  const submitPost = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: userData._id,
      desc: inputStr,
      user: userData,
    };

    const uploadImage = async () => {
      if (file) {
        const data = new FormData();
        const fileName = uuidv4() + file.name;
        data.append("name", fileName);
        data.append("file", file);
        newPost.img = fileName;
        console.log(newPost);
        try {
          const response = await axios.post(
            "https://socialapp-backend-production-a743.up.railway.app/upload",
            data
          );
          const downloadURL = response.data;
          newPost.img = downloadURL;
        } catch (err) {
          console.error(err);
        }
      }
    };

    const savePostToDatabase = async () => {
      try {
        await axios.post(
          "https://socialapp-backend-production-a743.up.railway.app/posts/",
          newPost
        );
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    };

    try {
      await Promise.all([uploadImage(), savePostToDatabase()]);
    } catch (err) {
      console.error(err);
    }
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
                  <ImgIcon />

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
