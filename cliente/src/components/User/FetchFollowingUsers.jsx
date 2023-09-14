import { useEffect } from "react";
import axios from "axios";
import { hostLink } from "../../utilities/host";

const FetchFollowingUsers = (userData, setFollowingUsers) => {
  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        if (Array.isArray(userData?.following)) {
          const userPromises = userData.following.map((userId) =>
            axios.get(`${hostLink}/users/${userId}`)
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
