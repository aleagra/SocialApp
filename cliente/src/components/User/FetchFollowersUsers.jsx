import { useEffect } from "react";
import axios from "axios";
import { hostLink } from "../../utilities/host";

const FetchFollowersUsers = (userData, setFollowersUsers) => {
  useEffect(() => {
    const fetchFollowersUsers = async () => {
      try {
        if (Array.isArray(userData?.followers)) {
          const userPromises = userData.followers.map((userId) =>
            axios.get(`${hostLink}/users/${userId}`)
          );

          const users = await Promise.all(userPromises);
          const followersUsersData = users.map((response) => response.data);
          followersUsersData.reverse(); // Ordenar al revés
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
