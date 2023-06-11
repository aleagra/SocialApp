import React, {
  createContext,
  useEffect,
  useReducer,
  useState,
  useCallback,
} from "react";
import AuthReducer from "./AuthReducer";
import axios from "axios";
import icon from "../assets/icon.png";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")),
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [userData, setUserData] = useState(null);
  const [followingCount, setFollowingCount] = useState();
  const [followedUserData, setFollowedUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPost] = useState([]);
  const [postsFriends, setPostFriends] = useState([]);
  const updateFollowedUserData = useCallback((data) => {
    setFollowedUserData(data);
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (state.user) {
          setIsLoading(true);

          const [userDataResponse, postsResponse, mypostsResponse] =
            await Promise.all([
              axios.get(
                `https://socialapp-backend-production-a743.up.railway.app/users/${state.user}`
              ),
              axios.get(
                `https://socialapp-backend-production-a743.up.railway.app/posts/friends/${state.user}`
              ),
              axios.get(
                `https://socialapp-backend-production-a743.up.railway.app/posts/user/${state.user}`
              ),
            ]);

          const user = userDataResponse.data;
          const userWithoutPassword = {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            avatarImage: user.avatarImage,
            followers: user.followers,
            following: user.following,
            isAvatarImageSet: user.isAvatarImageSet,
          };
          const posts = postsResponse.data;
          const myposts = mypostsResponse.data;

          dispatch({ type: "SET_USER", payload: user });
          setUserData(userWithoutPassword);

          setPostFriends(
            posts.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
          );

          setPost(
            myposts.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
          );

          // Fetch contacts
          if (Array.isArray(user?.following)) {
            const userPromises = user.following.map((userId) =>
              axios.get(
                `https://socialapp-backend-production-a743.up.railway.app/users/${userId}`
              )
            );
            const users = await Promise.all(userPromises);
            const followingUsersData = users.map((response) => response.data);
            setFollowedUserData(followingUsersData);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [state.user]);

  if (isLoading) {
    return (
      <div className="absolute z-40 bg-[#f7f7f7] w-full h-full flex items-center justify-center">
        <img src={icon} alt="" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
        followingCount,
        setFollowingCount,
        setFollowedUserData,
        followedUserData,
        updateFollowedUserData,
        userData,
        setUserData,
        posts,
        postsFriends,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
