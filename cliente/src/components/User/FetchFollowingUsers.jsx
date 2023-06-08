import { useEffect } from "react";
import axios from "axios";

const FetchFollowingUsers = (userData, setFollowingUsers) => {
  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        if (Array.isArray(userData?.following)) {
          const userPromises = userData.followers.map((userId) =>
            axios.get(`http://localhost:5050/users/${userId}`)
          );

          const users = await Promise.all(userPromises);
          const followingUsersData = users.map((response) => response.data);
          setFollowingUsers(followingUsersData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowingUsers();
  }, [userData?.following]);
};

export default FetchFollowingUsers;
