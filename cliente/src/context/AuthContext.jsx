import { createContext, useEffect, useReducer, useState } from "react";
import AuthReducer from "./AuthReducer";
import axios from "axios";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")),
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [userData, setUserData] = useState(null); // Agregar el useState para userData
  const [followingCount, setFollowingCount] = useState(0);
  const [followedUserData, setFollowedUserData] = useState([]);

  const updateFollowedUserData = (data) => {
    setFollowedUserData(data);
  };

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (state.user) {
          const response = await axios.get(
            `https://socialapp-backend-production-a743.up.railway.app/users/${state.user}`
          );
          const user = response.data;

          dispatch({ type: "SET_USER", payload: user });
          setUserData(user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [state.user]);

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
        setUserData, // Agregar userData al value del contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
