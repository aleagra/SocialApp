import { useEffect } from "react";
import axios from "axios";

const FetchFollowersUsers = (userData, setFollowersUsers) => {
  useEffect(() => {
    const fetchFollowersUsers = async () => {
      try {
        if (Array.isArray(userData?.followers)) {
          const userPromises = userData.followers.map((userId) =>
            axios.get(`http://localhost:5050/users/${userId}`)
          );

          const users = await Promise.all(userPromises);
          const followersUsersData = users.map((response) => response.data);
          setFollowersUsers(followersUsersData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowersUsers();
  }, [userData?.followers]);
};

export default FetchFollowersUsers;
